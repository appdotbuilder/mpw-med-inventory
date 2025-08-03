<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Medication>
 */
class MedicationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $dosageForms = ['Tablet', 'Kapsul', 'Sirup', 'Injeksi', 'Salep', 'Sachet'];
        $manufacturers = ['PT Kimia Farma', 'PT Sanbe Farma', 'PT Kalbe Farma', 'PT Tempo Scan Pacific'];

        return [
            'name' => fake()->word() . ' ' . fake()->randomNumber(3),
            'generic_name' => fake()->word(),
            'brand_name' => fake()->company(),
            'dosage_form' => fake()->randomElement($dosageForms),
            'strength' => fake()->randomNumber(3) . 'mg',
            'manufacturer' => fake()->randomElement($manufacturers),
            'batch_number' => fake()->bothify('??###'),
            'expiry_date' => fake()->dateTimeBetween('now', '+2 years'),
            'current_stock' => fake()->numberBetween(0, 1000),
            'minimum_stock' => fake()->numberBetween(10, 50),
            'unit_price' => fake()->numberBetween(500, 10000),
            'storage_conditions' => 'Simpan di tempat kering dan sejuk',
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the medication has low stock.
     */
    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'current_stock' => fake()->numberBetween(0, 9),
            'minimum_stock' => fake()->numberBetween(10, 20),
        ]);
    }

    /**
     * Indicate that the medication is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expiry_date' => fake()->dateTimeBetween('-1 year', '-1 day'),
        ]);
    }

    /**
     * Indicate that the medication is expiring soon.
     */
    public function expiringSoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'expiry_date' => now()->addDays(15), // Fixed date within 30 days
        ]);
    }
}