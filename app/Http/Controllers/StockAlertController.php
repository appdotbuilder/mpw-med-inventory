<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\StockAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockAlertController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $alerts = StockAlert::with('medication')
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->status === 'unread', function ($query) {
                $query->unread();
            })
            ->when($request->status === 'unresolved', function ($query) {
                $query->unresolved();
            })
            ->when($request->status === 'resolved', function ($query) {
                $query->where('is_resolved', true);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('alerts/index', [
            'alerts' => $alerts,
            'filters' => $request->only(['type', 'status']),
        ]);
    }

    /**
     * Mark alert as read.
     */
    public function store(Request $request)
    {
        $request->validate([
            'alert_id' => 'required|exists:stock_alerts,id',
            'action' => 'required|in:mark_read,resolve',
        ]);

        $alert = StockAlert::findOrFail($request->alert_id);

        if ($request->action === 'mark_read') {
            $alert->update(['is_read' => true]);
            $message = 'Alert berhasil ditandai sebagai sudah dibaca.';
        } else {
            $alert->update([
                'is_resolved' => true,
                'resolved_at' => now(),
                'resolved_by' => auth()->id(),
            ]);
            $message = 'Alert berhasil diselesaikan.';
        }

        return back()->with('success', $message);
    }
}