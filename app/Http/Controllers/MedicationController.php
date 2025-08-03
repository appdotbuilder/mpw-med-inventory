<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMedicationRequest;
use App\Http\Requests\UpdateMedicationRequest;
use App\Models\Medication;
use App\Models\StockAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MedicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $medications = Medication::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('generic_name', 'like', "%{$search}%")
                      ->orWhere('brand_name', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                if ($status === 'active') {
                    $query->active();
                } elseif ($status === 'inactive') {
                    $query->where('is_active', false);
                } elseif ($status === 'low_stock') {
                    $query->lowStock();
                } elseif ($status === 'expired') {
                    $query->expired();
                } elseif ($status === 'expiring_soon') {
                    $query->expiringSoon();
                }
            })
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('medications/index', [
            'medications' => $medications,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('medications/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMedicationRequest $request)
    {
        $medication = Medication::create($request->validated());

        // Check if medication needs alerts
        $this->checkAndCreateAlerts($medication);

        return redirect()->route('medications.show', $medication)
            ->with('success', 'Obat berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Medication $medication)
    {
        $medication->load(['stockMovements.user', 'stockAlerts' => function ($query) {
            $query->unresolved()->latest();
        }]);

        return Inertia::render('medications/show', [
            'medication' => $medication,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Medication $medication)
    {
        return Inertia::render('medications/edit', [
            'medication' => $medication,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMedicationRequest $request, Medication $medication)
    {
        $medication->update($request->validated());

        // Check if medication needs alerts
        $this->checkAndCreateAlerts($medication);

        return redirect()->route('medications.show', $medication)
            ->with('success', 'Obat berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Medication $medication)
    {
        $medication->delete();

        return redirect()->route('medications.index')
            ->with('success', 'Obat berhasil dihapus.');
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
        }

        // Expired alert
        if ($medication->is_expired) {
            StockAlert::firstOrCreate([
                'medication_id' => $medication->id,
                'type' => 'expired',
                'is_resolved' => false,
            ], [
                'message' => "{$medication->name} sudah kedaluwarsa pada {$medication->expiry_date?->format('d/m/Y')}",
            ]);
        }

        // Expiring soon alert
        if ($medication->is_expiring_soon) {
            StockAlert::firstOrCreate([
                'medication_id' => $medication->id,
                'type' => 'expiring_soon',
                'is_resolved' => false,
            ], [
                'message' => "{$medication->name} akan kedaluwarsa pada {$medication->expiry_date?->format('d/m/Y')}",
            ]);
        }
    }
}