import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { TrendingUp, TrendingDown, Plus, Calendar, Package, User } from 'lucide-react';

interface StockMovement {
  id: number;
  type: string;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  notes?: string;
  reference_number?: string;
  movement_date: string;
  created_at: string;
  medication: {
    id: number;
    name: string;
    strength: string;
  };
  user: {
    name: string;
  };
}

interface PaginatedMovements {
  data: StockMovement[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Medication {
  id: number;
  name: string;
}

interface Props {
  movements: PaginatedMovements;
  medications: Medication[];
  filters: {
    medication_id?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
  };
  [key: string]: unknown;
}

export default function StockMovementsIndex({ movements, medications, filters }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFilter = (key: string, value: string) => {
    router.get(route('stock-movements.index'), { ...filters, [key]: value }, {
      preserveScroll: true,
      replace: true,
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading>📊 Pergerakan Stok</Heading>
          <Button onClick={() => router.visit(route('stock-movements.create'))}>
            <Plus className="w-4 h-4 mr-2" />
            Catat Pergerakan
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Pergerakan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Obat
                </label>
                <select
                  value={filters.medication_id || ''}
                  onChange={(e) => handleFilter('medication_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Obat</option>
                  {medications.map((medication) => (
                    <option key={medication.id} value={medication.id}>
                      {medication.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilter('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Semua Jenis</option>
                  <option value="incoming">Masuk</option>
                  <option value="outgoing">Keluar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={filters.date_from || ''}
                  onChange={(e) => handleFilter('date_from', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={filters.date_to || ''}
                  onChange={(e) => handleFilter('date_to', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Movements List */}
        {movements.data.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pergerakan stok</h3>
              <p className="text-gray-500 mb-6">Mulai catat pergerakan stok obat</p>
              <Button onClick={() => router.visit(route('stock-movements.create'))}>
                <Plus className="w-4 h-4 mr-2" />
                Catat Pergerakan Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {movements.data.map((movement) => (
              <Card key={movement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        movement.type === 'incoming' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {movement.type === 'incoming' ? (
                          <TrendingUp className="w-6 h-6" />
                        ) : (
                          <TrendingDown className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {movement.medication.name}
                          </h3>
                          <Badge variant={movement.type === 'incoming' ? 'default' : 'secondary'}>
                            {movement.type === 'incoming' ? 'Masuk' : 'Keluar'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          <p className="font-medium">{movement.medication.strength}</p>
                          <p>Alasan: {movement.reason}</p>
                          {movement.reference_number && (
                            <p>Referensi: {movement.reference_number}</p>
                          )}
                          {movement.notes && (
                            <p>Catatan: {movement.notes}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{movement.user.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(movement.movement_date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {movement.type === 'incoming' ? '+' : '-'}{movement.quantity}
                      </div>
                      <div className="text-sm text-gray-500">
                        {movement.previous_stock} → {movement.new_stock}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {movements.last_page > 1 && (
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <div className="text-sm text-gray-500">
                Menampilkan {((movements.current_page - 1) * movements.per_page) + 1} - {Math.min(movements.current_page * movements.per_page, movements.total)} dari {movements.total} pergerakan
              </div>
              <div className="flex gap-2">
                {movements.current_page > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.get(route('stock-movements.index'), { ...filters, page: movements.current_page - 1 })}
                  >
                    Sebelumnya
                  </Button>
                )}
                {movements.current_page < movements.last_page && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.get(route('stock-movements.index'), { ...filters, page: movements.current_page + 1 })}
                  >
                    Selanjutnya
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}