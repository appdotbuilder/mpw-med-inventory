<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StockAlertController;
use App\Http\Controllers\StockMovementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', [DashboardController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Medication management
    Route::resource('medications', MedicationController::class);
    
    // Stock movements
    Route::resource('stock-movements', StockMovementController::class)
        ->except(['edit', 'update', 'destroy']);
    
    // Stock alerts
    Route::get('/alerts', [StockAlertController::class, 'index'])->name('alerts.index');
    Route::post('/alerts', [StockAlertController::class, 'store'])->name('alerts.store');
    
    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
