<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\StockAlert
 *
 * @property int $id
 * @property int $medication_id
 * @property string $type
 * @property string $message
 * @property bool $is_read
 * @property bool $is_resolved
 * @property \Illuminate\Support\Carbon|null $resolved_at
 * @property int|null $resolved_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Medication $medication
 * @property-read \App\Models\User|null $resolver
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert query()
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert unread()
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert unresolved()
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert lowStock()
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert expired()
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert expiringSoon()
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert whereIsRead($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert whereIsResolved($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert whereMedicationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert whereResolvedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert whereResolvedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StockAlert whereUpdatedAt($value)
 * @method static \Database\Factories\StockAlertFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class StockAlert extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'medication_id',
        'type',
        'message',
        'is_read',
        'is_resolved',
        'resolved_at',
        'resolved_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'medication_id' => 'integer',
        'is_read' => 'boolean',
        'is_resolved' => 'boolean',
        'resolved_at' => 'datetime',
        'resolved_by' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the medication that owns this alert.
     */
    public function medication(): BelongsTo
    {
        return $this->belongsTo(Medication::class);
    }

    /**
     * Get the user who resolved this alert.
     */
    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    /**
     * Scope a query to only include unread alerts.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope a query to only include unresolved alerts.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUnresolved($query)
    {
        return $query->where('is_resolved', false);
    }

    /**
     * Scope a query to only include low stock alerts.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLowStock($query)
    {
        return $query->where('type', 'low_stock');
    }

    /**
     * Scope a query to only include expired alerts.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeExpired($query)
    {
        return $query->where('type', 'expired');
    }

    /**
     * Scope a query to only include expiring soon alerts.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeExpiringSoon($query)
    {
        return $query->where('type', 'expiring_soon');
    }
}