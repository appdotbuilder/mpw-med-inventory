<?php

namespace Database\Factories;

use App\Models\Medication;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockAlert>
 */
class StockAlertFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['low_stock', 'expired', 'expiring_soon']);
        
        $messages = [
            'low_stock' => 'Stok rendah - segera lakukan pemesanan ulang',
            'expired' => 'Obat sudah kedaluwarsa - segera lakukan penarikan',
            'expiring_soon' => 'Obat akan kedaluwarsa dalam 30 hari',
        ];

        return [
            'medication_id' => Medication::factory(),
            'type' => $type,
            'message' => $messages[$type],
            'is_read' => fake()->boolean(30), // 30% chance of being read
            'is_resolved' => fake()->boolean(20), // 20% chance of being resolved
            'resolved_at' => fake()->optional(20)->dateTimeBetween('-1 month', 'now'),
            'resolved_by' => fake()->optional(20)->randomElement(User::pluck('id')->toArray()),
        ];
    }

    /**
     * Indicate that the alert is unread.
     */
    public function unread(): static
    {
        return $this->state([
            'is_read' => false,
        ]);
    }

    /**
     * Indicate that the alert is unresolved.
     */
    public function unresolved(): static
    {
        return $this->state([
            'is_resolved' => false,
            'resolved_at' => null,
            'resolved_by' => null,
        ]);
    }

    /**
     * Indicate that the alert is for low stock.
     */
    public function lowStock(): static
    {
        return $this->state([
            'type' => 'low_stock',
            'message' => 'Stok rendah - segera lakukan pemesanan ulang',
        ]);
    }

    /**
     * Indicate that the alert is for expired medication.
     */
    public function expired(): static
    {
        return $this->state([
            'type' => 'expired',
            'message' => 'Obat sudah kedaluwarsa - segera lakukan penarikan',
        ]);
    }

    /**
     * Indicate that the alert is for medication expiring soon.
     */
    public function expiringSoon(): static
    {
        return $this->state([
            'type' => 'expiring_soon',
            'message' => 'Obat akan kedaluwarsa dalam 30 hari',
        ]);
    }
}