<?php

namespace Database\Factories;

use App\Models\Medication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockMovement>
 */
class StockMovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['incoming', 'outgoing']);
        $quantity = fake()->numberBetween(1, 100);
        $previousStock = fake()->numberBetween(0, 500);
        
        $newStock = $type === 'incoming' 
            ? $previousStock + $quantity 
            : max(0, $previousStock - $quantity);

        $reasons = [
            'incoming' => ['Pembelian', 'Donasi', 'Transfer masuk', 'Koreksi stok'],
            'outgoing' => ['Penjualan', 'Dispensing', 'Transfer keluar', 'Expired', 'Rusak'],
        ];

        return [
            'medication_id' => Medication::factory(),
            'user_id' => User::factory(),
            'type' => $type,
            'quantity' => $quantity,
            'previous_stock' => $previousStock,
            'new_stock' => $newStock,
            'reason' => fake()->randomElement($reasons[$type]),
            'notes' => fake()->optional()->sentence(),
            'reference_number' => fake()->optional()->bothify('REF-####'),
            'movement_date' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    /**
     * Indicate that this is an incoming stock movement.
     */
    public function incoming(): static
    {
        return $this->state([
            'type' => 'incoming',
            'reason' => fake()->randomElement(['Pembelian', 'Donasi', 'Transfer masuk']),
        ]);
    }

    /**
     * Indicate that this is an outgoing stock movement.
     */
    public function outgoing(): static
    {
        return $this->state([
            'type' => 'outgoing',
            'reason' => fake()->randomElement(['Penjualan', 'Dispensing', 'Transfer keluar']),
        ]);
    }
}