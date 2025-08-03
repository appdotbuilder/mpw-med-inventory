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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('email_verified_at')->constrained();
            $table->string('clinic_name')->nullable()->after('role_id')->comment('Name of clinic/facility');
            $table->string('position')->nullable()->after('clinic_name')->comment('User position/title');
            $table->boolean('is_active')->default(true)->after('position')->comment('Whether user account is active');
            
            $table->index('role_id');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropColumn(['role_id', 'clinic_name', 'position', 'is_active']);
        });
    }
};