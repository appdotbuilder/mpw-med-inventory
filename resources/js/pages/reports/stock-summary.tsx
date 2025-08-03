import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Heading } from '@/components/heading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, DollarSign, TrendingUp } from 'lucide-react';

interface Medication {
  id: number;
  name: string;
  generic_name?: string;
  current_stock: number;
  minimum_stock: number;
  unit_price: number;
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
  totalValue: number;
  totalItems: number;
  filters: {
    search?: string;
  };
  [key: string]: unknown;
}

export default function StockSummaryReport({ medications, totalValue, totalItems }: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStockStatus = (medication: Medication) => {
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

  return (
    <AppShell>
      <div className="space-y-6">
        <Heading>📊 Laporan Ringkasan Stok</Heading>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Obat</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medications.total}</div>
              <p className="text-xs text-muted-foreground">
                Jenis obat aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">
                Unit obat tersedia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nilai Inventori</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Total nilai stok
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Medications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Stok Obat</CardTitle>
            <CardDescription>
              Daftar lengkap semua obat dengan informasi stok dan nilai
            </CardDescription>
          </CardHeader>
          <CardContent>
            {medications.data.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data obat
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Nama Obat</th>
                      <th className="text-left py-3 px-2">Stok Saat Ini</th>
                      <th className="text-left py-3 px-2">Stok Minimum</th>
                      <th className="text-right py-3 px-2">Harga Satuan</th>
                      <th className="text-right py-3 px-2">Nilai Total</th>
                      <th className="text-center py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.data.map((medication) => (
                      <tr key={medication.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-medium">{medication.name}</div>
                            {medication.generic_name && (
                              <div className="text-gray-500 text-xs">
                                {medication.generic_name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`font-medium ${
                            medication.current_stock <= medication.minimum_stock 
                              ? 'text-red-600' 
                              : 'text-gray-900'
                          }`}>
                            {medication.current_stock.toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {medication.minimum_stock.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-2 text-right">
                          {formatCurrency(medication.unit_price)}
                        </td>
                        <td className="py-3 px-2 text-right font-medium">
                          {formatCurrency(medication.current_stock * medication.unit_price)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {getStockStatus(medication)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}