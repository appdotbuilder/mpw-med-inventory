<?php

namespace Database\Seeders;

use App\Models\Medication;
use Illuminate\Database\Seeder;

class MedicationSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $medications = [
            [
                'name' => 'Paracetamol',
                'generic_name' => 'Acetaminophen',
                'brand_name' => 'Panadol',
                'dosage_form' => 'Tablet',
                'strength' => '500mg',
                'manufacturer' => 'PT Kimia Farma',
                'batch_number' => 'PAR001',
                'expiry_date' => now()->addMonths(18),
                'current_stock' => 500,
                'minimum_stock' => 50,
                'unit_price' => 500,
                'storage_conditions' => 'Simpan di tempat kering dan sejuk',
                'description' => 'Obat penurun demam dan pereda nyeri',
            ],
            [
                'name' => 'Amoxicillin',
                'generic_name' => 'Amoxicillin',
                'brand_name' => 'Amoxsan',
                'dosage_form' => 'Kapsul',
                'strength' => '250mg',
                'manufacturer' => 'PT Sanbe Farma',
                'batch_number' => 'AMX002',
                'expiry_date' => now()->addYear(),
                'current_stock' => 200,
                'minimum_stock' => 30,
                'unit_price' => 1200,
                'storage_conditions' => 'Simpan di tempat kering, suhu kamar',
                'description' => 'Antibiotik untuk infeksi bakteri',
            ],
            [
                'name' => 'ORS',
                'generic_name' => 'Oral Rehydration Salt',
                'brand_name' => 'Oralit',
                'dosage_form' => 'Sachet',
                'strength' => '200ml',
                'manufacturer' => 'PT Pharos Indonesia',
                'batch_number' => 'ORS003',
                'expiry_date' => now()->addMonths(24),
                'current_stock' => 100,
                'minimum_stock' => 25,
                'unit_price' => 2500,
                'storage_conditions' => 'Simpan di tempat kering',
                'description' => 'Larutan rehidrasi oral untuk diare',
            ],
            [
                'name' => 'Vitamin C',
                'generic_name' => 'Ascorbic Acid',
                'brand_name' => 'CDR',
                'dosage_form' => 'Tablet Effervescent',
                'strength' => '1000mg',
                'manufacturer' => 'PT Darya-Varia Laboratoria',
                'batch_number' => 'VTC004',
                'expiry_date' => now()->addDays(20), // Expiring soon
                'current_stock' => 8, // Low stock
                'minimum_stock' => 15,
                'unit_price' => 3500,
                'storage_conditions' => 'Simpan di tempat kering, hindari cahaya langsung',
                'description' => 'Suplemen vitamin C untuk daya tahan tubuh',
            ],
            [
                'name' => 'Ibuprofen',
                'generic_name' => 'Ibuprofen',
                'brand_name' => 'Proris',
                'dosage_form' => 'Tablet',
                'strength' => '400mg',
                'manufacturer' => 'PT Tempo Scan Pacific',
                'batch_number' => 'IBU005',
                'expiry_date' => now()->subDays(10), // Expired
                'current_stock' => 25,
                'minimum_stock' => 20,
                'unit_price' => 800,
                'storage_conditions' => 'Simpan di tempat kering dan sejuk',
                'description' => 'Obat anti-inflamasi dan pereda nyeri',
            ],
        ];

        foreach ($medications as $medication) {
            Medication::firstOrCreate(
                ['name' => $medication['name'], 'strength' => $medication['strength']],
                $medication
            );
        }
    }
}