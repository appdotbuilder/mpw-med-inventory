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
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medication_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained();
            $table->enum('type', ['incoming', 'outgoing'])->comment('Type of stock movement');
            $table->integer('quantity')->comment('Quantity moved (positive for incoming, outgoing handled by type)');
            $table->integer('previous_stock')->comment('Stock level before movement');
            $table->integer('new_stock')->comment('Stock level after movement');
            $table->string('reason')->comment('Reason for movement (purchase, dispensed, expired, etc.)');
            $table->text('notes')->nullable()->comment('Additional notes');
            $table->string('reference_number')->nullable()->comment('Reference number (PO, prescription, etc.)');
            $table->timestamp('movement_date')->comment('When the movement occurred');
            $table->timestamps();
            
            $table->index('medication_id');
            $table->index('user_id');
            $table->index('type');
            $table->index('movement_date');
            $table->index(['medication_id', 'movement_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};