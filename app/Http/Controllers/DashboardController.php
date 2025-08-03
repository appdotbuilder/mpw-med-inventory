<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Medication;
use App\Models\StockAlert;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the medication inventory dashboard.
     */
    public function index(Request $request)
    {
        // Dashboard statistics
        $stats = [
            'total_medications' => Medication::active()->count(),
            'low_stock_count' => Medication::active()->lowStock()->count(),
            'expired_count' => Medication::active()->expired()->count(),
            'expiring_soon_count' => Medication::active()->expiringSoon()->count(),
            'total_stock_value' => Medication::active()->sum(\DB::raw('current_stock * unit_price')),
        ];

        // Recent stock movements
        $recentMovements = StockMovement::with(['medication', 'user'])
            ->recent()
            ->limit(10)
            ->get();

        // Active alerts
        $alerts = StockAlert::with('medication')
            ->unresolved()
            ->latest()
            ->limit(10)
            ->get();

        // Low stock medications
        $lowStockMedications = Medication::active()
            ->lowStock()
            ->orderBy('current_stock')
            ->limit(10)
            ->get();

        // Medications expiring soon
        $expiringSoonMedications = Medication::active()
            ->expiringSoon()
            ->orderBy('expiry_date')
            ->limit(10)
            ->get();

        // Stock movement trends (last 30 days)
        $movementTrends = StockMovement::selectRaw('
                DATE(movement_date) as date,
                type,
                COUNT(*) as count,
                SUM(quantity) as total_quantity
            ')
            ->where('movement_date', '>=', now()->subDays(30))
            ->groupBy('date', 'type')
            ->orderBy('date')
            ->get()
            ->groupBy('date');

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentMovements' => $recentMovements,
            'alerts' => $alerts,
            'lowStockMedications' => $lowStockMedications,
            'expiringSoonMedications' => $expiringSoonMedications,
            'movementTrends' => $movementTrends,
        ]);
    }
}