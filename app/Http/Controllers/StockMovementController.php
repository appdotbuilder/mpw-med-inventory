<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StockMovementRequest;
use App\Models\Medication;
use App\Models\StockMovement;
use App\Models\StockAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
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
            ->paginate(15)
            ->withQueryString();

        $medications = Medication::active()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('stock-movements/index', [
            'movements' => $movements,
            'medications' => $medications,
            'filters' => $request->only(['medication_id', 'type', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $medications = Medication::active()->orderBy('name')->get(['id', 'name', 'current_stock']);
        $selectedMedication = null;

        if ($request->medication_id) {
            $selectedMedication = Medication::find($request->medication_id);
         }

        return Inertia::render('stock-movements/create', [
            'medications' => $medications,
            'selectedMedication' => $selectedMedication,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StockMovementRequest $request)
    {
        $medication = Medication::findOrFail($request->medication_id);
        $previousStock = $medication->current_stock;

        // Calculate new stock based on movement type
        $newStock = $request->type === 'incoming'
            ? $previousStock + $request->quantity
            : $previousStock - $request->quantity;

        // Validate outgoing stock doesn't go below zero
        if ($newStock < 0) {
            return back()->withErrors([
                'quantity' => 'Stok tidak mencukupi. Stok saat ini: ' . $previousStock,
            ]);
        }

        // Create stock movement record
        $movement = StockMovement::create([
            'medication_id' => $request->medication_id,
            'user_id' => auth()->id(),
            'type' => $request->type,
            'quantity' => $request->quantity,
            'previous_stock' => $previousStock,
            'new_stock' => $newStock,
            'reason' => $request->reason,
            'notes' => $request->notes,
            'reference_number' => $request->reference_number,
            'movement_date' => $request->movement_date,
        ]);

        // Update medication stock
        $medication->update(['current_stock' => $newStock]);

        // Check and create alerts
        $this->checkAndCreateAlerts($medication);

        return redirect()->route('stock-movements.index')
            ->with('success', 'Pergerakan stok berhasil dicatat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(StockMovement $stockMovement)
    {
        $stockMovement->load(['medication', 'user']);

        return Inertia::render('stock-movements/show', [
            'movement' => $stockMovement,
        ]);
    }

    /**
     * Check and create alerts for medication.
     *
     * @param  \App\Models\Medication  $medication
     * @return void
     */
    protected function checkAndCreateAlerts(Medication $medication): void
    {
        // Low stock alert
        if ($medication->is_low_stock) {
            StockAlert::firstOrCreate([
                'medication_id' => $medication->id,
                'type' => 'low_stock',
                'is_resolved' => false,
            ], [
                'message' => "Stok {$medication->name} rendah ({$medication->current_stock} tersisa, minimum {$medication->minimum_stock})",
            ]);
        } else {
            // Resolve low stock alert if stock is now sufficient
            StockAlert::where([
                'medication_id' => $medication->id,
                'type' => 'low_stock',
                'is_resolved' => false,
            ])->update([
                'is_resolved' => true,
                'resolved_at' => now(),
                'resolved_by' => auth()->id(),
            ]);
        }
    }
}