<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'administrator',
                'display_name' => 'Administrator',
                'description' => 'Full access to all medication inventory features including user management and system configuration.',
            ],
            [
                'name' => 'regular_user',
                'display_name' => 'Regular User',
                'description' => 'Can view medication inventory, update stock levels, and generate reports. Cannot manage users or system settings.',
            ],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}