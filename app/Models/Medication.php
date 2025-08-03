<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Medication
 *
 * @property int $id
 * @property string $name
 * @property string|null $generic_name
 * @property string|null $brand_name
 * @property string $dosage_form
 * @property string $strength
 * @property string|null $manufacturer
 * @property string|null $batch_number
 * @property \Illuminate\Support\Carbon|null $expiry_date
 * @property int $current_stock
 * @property int $minimum_stock
 * @property string $unit_price
 * @property string|null $storage_conditions
 * @property string|null $description
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockMovement> $stockMovements
 * @property-read int|null $stock_movements_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StockAlert> $stockAlerts
 * @property-read int|null $stock_alerts_count
 * @property-read bool $is_low_stock
 * @property-read bool $is_expired
 * @property-read bool $is_expiring_soon
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Medication newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Medication newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Medication query()
 * @method static \Illuminate\Database\Eloquent\Builder|Medication active()
 * @method static \Illuminate\Database\Eloquent\Builder|Medication lowStock()
 * @method static \Illuminate\Database\Eloquent\Builder|Medication expiringSoon()
 * @method static \Illuminate\Database\Eloquent\Builder|Medication expired()
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereBatchNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereBrandName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereCurrentStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereDosageForm($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereExpiryDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereGenericName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereManufacturer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereMinimumStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereStorageConditions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereStrength($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereUnitPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Medication whereUpdatedAt($value)
 * @method static \Database\Factories\MedicationFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Medication extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'generic_name',
        'brand_name',
        'dosage_form',
        'strength',
        'manufacturer',
        'batch_number',
        'expiry_date',
        'current_stock',
        'minimum_stock',
        'unit_price',
        'storage_conditions',
        'description',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expiry_date' => 'date',
        'current_stock' => 'integer',
        'minimum_stock' => 'integer',
        'unit_price' => 'decimal:2',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the stock movements for this medication.
     */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Get the stock alerts for this medication.
     */
    public function stockAlerts(): HasMany
    {
        return $this->hasMany(StockAlert::class);
    }

    /**
     * Scope a query to only include active medications.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include medications with low stock.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLowStock($query)
    {
        return $query->whereColumn('current_stock', '<=', 'minimum_stock');
    }

    /**
     * Scope a query to only include medications expiring soon (within 30 days).
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeExpiringSoon($query)
    {
        return $query->where('expiry_date', '>', now())
                    ->where('expiry_date', '<=', now()->addDays(30));
    }

    /**
     * Scope a query to only include expired medications.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now());
    }

    /**
     * Check if medication has low stock.
     *
     * @return bool
     */
    public function getIsLowStockAttribute(): bool
    {
        return $this->current_stock <= $this->minimum_stock;
    }

    /**
     * Check if medication is expired.
     *
     * @return bool
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    /**
     * Check if medication is expiring soon (within 30 days).
     *
     * @return bool
     */
    public function getIsExpiringSoonAttribute(): bool
    {
        if (!$this->expiry_date || $this->expiry_date->isPast()) {
            return false;
        }
        
        return $this->expiry_date->diffInDays(now()) <= 30;
    }
}