import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { Package, Plus, Eye, Edit, Search } from 'lucide-react';

interface Medication {
  id: number;
  name: string;
  generic_name?: string;
  brand_name?: string;
  dosage_form: string;
  strength: string;
  manufacturer?: string;
  current_stock: number;
  minimum_stock: number;
  unit_price: number;
  expiry_date?: string;
  is_active: boolean;
  is_low_stock: boolean;
  is_expired: boolean;
  is_expiring_soon: boolean;
}

interface PaginatedMedications {
  data: Medication[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  medications: PaginatedMedications;
  filters: {
    search?: string;
    status?: string;
  };
  [key: string]: unknown;
}

export default function MedicationsIndex({ medications, filters }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStockBadge = (medication: Medication) => {
    if (medication.is_expired) {
      return <Badge variant="destructive">Kedaluwarsa</Badge>;
    }
    if (medication.is_low_stock) {
      return <Badge variant="secondary">Stok Rendah</Badge>;
    }
    if (medication.is_expiring_soon) {
      return <Badge variant="outline">Akan Kedaluwarsa</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
  };

  const handleSearch = (search: string) => {
    router.get(route('medications.index'), { ...filters, search }, {
      preserveScroll: true,
      replace: true,
    });
  };

  const handleFilter = (status: string) => {
    router.get(route('medications.index'), { ...filters, status }, {
      preserveScroll: true,
      replace: true,
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading>💊 Kelola Obat</Heading>
          <Button onClick={() => router.visit(route('medications.create'))}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Obat
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari obat..."
                    defaultValue={filters.search || ''}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={filters.status === 'active' ? 'default' : 'outline'}
                  onClick={() => handleFilter('active')}
                >
                  Aktif
                </Button>
                <Button 
                  variant={filters.status === 'low_stock' ? 'default' : 'outline'}
                  onClick={() => handleFilter('low_stock')}
                >
                  Stok Rendah
                </Button>
                <Button 
                  variant={filters.status === 'expired' ? 'default' : 'outline'}
                  onClick={() => handleFilter('expired')}
                >
                  Kedaluwarsa
                </Button>
                <Button 
                  variant={filters.status === 'expiring_soon' ? 'default' : 'outline'}
                  onClick={() => handleFilter('expiring_soon')}
                >
                  Akan Kedaluwarsa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medications Grid */}
        {medications.data.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada obat</h3>
              <p className="text-gray-500 mb-6">Mulai tambahkan obat ke dalam sistem inventori</p>
              <Button onClick={() => router.visit(route('medications.create'))}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Obat Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {medications.data.map((medication) => (
              <Card key={medication.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{medication.name}</CardTitle>
                      {medication.generic_name && (
                        <CardDescription className="font-medium">
                          {medication.generic_name}
                        </CardDescription>
                      )}
                      <CardDescription>
                        {medication.dosage_form} • {medication.strength}
                      </CardDescription>
                    </div>
                    {getStockBadge(medication)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Stok Saat Ini:</span>
                      <p className="font-medium">{medication.current_stock}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Stok Minimum:</span>
                      <p className="font-medium">{medication.minimum_stock}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Harga:</span>
                      <p className="font-medium">{formatCurrency(medication.unit_price)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Kedaluwarsa:</span>
                      <p className="font-medium">{formatDate(medication.expiry_date)}</p>
                    </div>
                  </div>

                  {medication.manufacturer && (
                    <div className="text-sm">
                      <span className="text-gray-500">Produsen:</span>
                      <p className="font-medium">{medication.manufacturer}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => router.visit(route('medications.show', medication.id))}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => router.visit(route('medications.edit', medication.id))}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {medications.last_page > 1 && (
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <div className="text-sm text-gray-500">
                Menampilkan {((medications.current_page - 1) * medications.per_page) + 1} - {Math.min(medications.current_page * medications.per_page, medications.total)} dari {medications.total} obat
              </div>
              <div className="flex gap-2">
                {medications.current_page > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.get(route('medications.index'), { ...filters, page: medications.current_page - 1 })}
                  >
                    Sebelumnya
                  </Button>
                )}
                {medications.current_page < medications.last_page && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.get(route('medications.index'), { ...filters, page: medications.current_page + 1 })}
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