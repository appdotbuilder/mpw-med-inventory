<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Medication;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display medication reports.
     */
    public function index(Request $request)
    {
        $reportType = $request->get('type', 'stock_summary');

        switch ($reportType) {
            case 'stock_movements':
                return $this->stockMovementsReport($request);
            case 'low_stock':
                return $this->lowStockReport($request);
            case 'expiry':
                return $this->expiryReport($request);
            default:
                return $this->stockSummaryReport($request);
        }
    }

    /**
     * Stock summary report.
     */
    protected function stockSummaryReport(Request $request)
    {
        $medications = Medication::active()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('generic_name', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        $totalValue = Medication::active()->sum(\DB::raw('current_stock * unit_price'));
        $totalItems = Medication::active()->sum('current_stock');

        return Inertia::render('reports/stock-summary', [
            'medications' => $medications,
            'totalValue' => $totalValue,
            'totalItems' => $totalItems,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Stock movements report.
     */
    protected function stockMovementsReport(Request $request)
    {
        $movements = StockMovement::with(['medication', 'user'])
            ->when($request->medication_id, function ($query, $medicationId) {
                $query->where('medication_id', $medicationId);
            })
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->date_from, function ($query, $dateFrom) {
                $query->whereDate('movement_date', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                $query->whereDate('movement_date', '<=', $dateTo);
            })
            ->recent()
            ->paginate(20)
            ->withQueryString();

        $medications = Medication::active()->orderBy('name')->get(['id', 'name']);

        // Summary statistics
        $summary = StockMovement::when($request->date_from, function ($query, $dateFrom) {
                $query->whereDate('movement_date', '>=', $dateFrom);
            })
            ->when($request->date_to, function ($query, $dateTo) {
                $query->whereDate('movement_date', '<=', $dateTo);
            })
            ->selectRaw('
                type,
                COUNT(*) as total_transactions,
                SUM(quantity) as total_quantity
            ')
            ->groupBy('type')
            ->get()
            ->keyBy('type');

        return Inertia::render('reports/stock-movements', [
            'movements' => $movements,
            'medications' => $medications,
            'summary' => $summary,
            'filters' => $request->only(['medication_id', 'type', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Low stock report.
     */
    protected function lowStockReport(Request $request)
    {
        $medications = Medication::active()
            ->lowStock()
            ->orderBy('current_stock')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('reports/low-stock', [
            'medications' => $medications,
        ]);
    }

    /**
     * Expiry report.
     */
    protected function expiryReport(Request $request)
    {
        $expired = Medication::active()
            ->expired()
            ->orderBy('expiry_date')
            ->get();

        $expiringSoon = Medication::active()
            ->expiringSoon()
            ->orderBy('expiry_date')
            ->get();

        return Inertia::render('reports/expiry', [
            'expired' => $expired,
            'expiringSoon' => $expiringSoon,
        ]);
    }
}