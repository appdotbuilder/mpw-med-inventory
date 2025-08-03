<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('medications', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Medication name');
            $table->string('generic_name')->nullable()->comment('Generic name of medication');
            $table->string('brand_name')->nullable()->comment('Brand name of medication');
            $table->string('dosage_form')->comment('Form of medication (tablet, capsule, syrup, etc.)');
            $table->string('strength')->comment('Medication strength (e.g., 500mg, 10ml)');
            $table->string('manufacturer')->nullable()->comment('Manufacturer name');
            $table->string('batch_number')->nullable()->comment('Batch/lot number');
            $table->date('expiry_date')->nullable()->comment('Expiration date');
            $table->integer('current_stock')->default(0)->comment('Current stock quantity');
            $table->integer('minimum_stock')->default(10)->comment('Minimum stock threshold for alerts');
            $table->decimal('unit_price', 10, 2)->default(0)->comment('Unit price in IDR');
            $table->string('storage_conditions')->nullable()->comment('Storage requirements');
            $table->text('description')->nullable()->comment('Additional medication details');
            $table->boolean('is_active')->default(true)->comment('Whether medication is active');
            $table->timestamps();
            
            $table->index('name');
            $table->index('generic_name');
            $table->index('current_stock');
            $table->index('minimum_stock');
            $table->index('expiry_date');
            $table->index(['is_active', 'current_stock']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};