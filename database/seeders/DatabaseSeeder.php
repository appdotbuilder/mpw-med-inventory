<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            MedicationSeeder::class,
        ]);

        // Create admin user
        $adminRole = Role::where('name', 'administrator')->first();
        $regularRole = Role::where('name', 'regular_user')->first();

        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@kemenpu.go.id',
            'role_id' => $adminRole->id,
            'clinic_name' => 'Klinik Utama Kementerian PUPR',
            'position' => 'Kepala Farmasi',
        ]);

        User::factory()->create([
            'name' => 'User Biasa',
            'email' => 'user@kemenpu.go.id',
            'role_id' => $regularRole->id,
            'clinic_name' => 'Klinik Cabang Jakarta',
            'position' => 'Apoteker',
        ]);
    }
}
