<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\StockMovement
 *
 * @property int $id
 * @property int $medication_id
 * @property int $user_id
 * @property string $type
 * @property int $quantity
 * @property int $previous_stock
 * @property int $new_stock
 * @property string $reason
 * @property string|null $notes
 * @property string|null $reference_number
 * @property \Illuminate\Support\Carbon $movement_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Medication $medication
 * @property-read \App\Models\User $user
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement query()
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement incoming()
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement outgoing()
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement recent()
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereMedicationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereMovementDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereNewStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement wherePreviousStock($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereReferenceNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockMovement whereUserId($value)
 * @method static \Database\Factories\StockMovementFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class StockMovement extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'medication_id',
        'user_id',
        'type',
        'quantity',
        'previous_stock',
        'new_stock',
        'reason',
        'notes',
        'reference_number',
        'movement_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'medication_id' => 'integer',
        'user_id' => 'integer',
        'quantity' => 'integer',
        'previous_stock' => 'integer',
        'new_stock' => 'integer',
        'movement_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the medication that owns this stock movement.
     */
    public function medication(): BelongsTo
    {
        return $this->belongsTo(Medication::class);
    }

    /**
     * Get the user that performed this stock movement.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include incoming stock movements.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeIncoming($query)
    {
        return $query->where('type', 'incoming');
    }

    /**
     * Scope a query to only include outgoing stock movements.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOutgoing($query)
    {
        return $query->where('type', 'outgoing');
    }

    /**
     * Scope a query to order by most recent movements.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRecent($query)
    {
        return $query->orderBy('movement_date', 'desc');
    }
}