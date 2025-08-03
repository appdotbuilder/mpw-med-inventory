import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { router } from '@inertiajs/react';
import { 
  Package, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Plus,
  FileText,
  Bell,
  Activity
} from 'lucide-react';

interface StockMovement {
  id: number;
  type: string;
  quantity: number;
  reason: string;
  movement_date: string;
  medication: {
    name: string;
  };
  user: {
    name: string;
  };
}

interface StockAlert {
  id: number;
  type: string;
  message: string;
  created_at: string;
  medication: {
    name: string;
  };
}

interface Medication {
  id: number;
  name: string;
  current_stock: number;
  minimum_stock: number;
  expiry_date?: string;
  unit_price: number;
}

interface Props {
  stats: {
    total_medications: number;
    low_stock_count: number;
    expired_count: number;
    expiring_soon_count: number;
    total_stock_value: number;
  };
  recentMovements: StockMovement[];
  alerts: StockAlert[];
  lowStockMedications: Medication[];
  expiringSoonMedications: Medication[];
  movementTrends: Record<string, unknown>;
  [key: string]: unknown;
}

export default function Dashboard({ 
  stats, 
  recentMovements, 
  alerts, 
  lowStockMedications, 
  expiringSoonMedications 
}: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleQuickAction = (action: string, medicationId?: number) => {
    switch (action) {
      case 'add_medication':
        router.visit(route('medications.create'));
        break;
      case 'stock_in':
        router.visit(route('stock-movements.create', { type: 'incoming' }));
        break;
      case 'stock_out':
        router.visit(route('stock-movements.create', { type: 'outgoing' }));
        break;
      case 'view_medication':
        if (medicationId) {
          router.visit(route('medications.show', medicationId));
        }
        break;
      case 'add_stock':
        if (medicationId) {
          router.visit(route('stock-movements.create', { medication_id: medicationId, type: 'incoming' }));
        }
        break;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading>📋 Dashboard Inventori Obat</Heading>
          <div className="flex space-x-2">
            <Button onClick={() => handleQuickAction('add_medication')}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Obat
            </Button>
            <Button variant="outline" onClick={() => handleQuickAction('stock_in')}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Stok Masuk
            </Button>
            <Button variant="outline" onClick={() => handleQuickAction('stock_out')}>
              <TrendingDown className="w-4 h-4 mr-2" />
              Stok Keluar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Obat</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_medications}</div>
              <p className="text-xs text-muted-foreground">
                Obat aktif dalam sistem
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.low_stock_count}</div>
              <p className="text-xs text-muted-foreground">
                Perlu segera diisi ulang
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kedaluwarsa</CardTitle>
              <Calendar className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.expired_count}</div>
              <p className="text-xs text-muted-foreground">
                Obat sudah kedaluwarsa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Akan Kedaluwarsa</CardTitle>
              <Calendar className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.expiring_soon_count}</div>
              <p className="text-xs text-muted-foreground">
                Dalam 30 hari
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nilai Stok</CardTitle>
              <Activity className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.total_stock_value)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total nilai inventori
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Peringatan Aktif
              </CardTitle>
              <CardDescription>
                {alerts.length} peringatan yang memerlukan perhatian
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <Alert key={alert.id} className={
                  alert.type === 'expired' ? 'border-red-200 bg-red-50' :
                  alert.type === 'low_stock' ? 'border-orange-200 bg-orange-50' :
                  'border-yellow-200 bg-yellow-50'
                }>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{alert.medication.name}</span> - {alert.message}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(alert.created_at)}
                      </span>
                    </div>
                    <Badge variant={
                      alert.type === 'expired' ? 'destructive' :
                      alert.type === 'low_stock' ? 'secondary' :
                      'outline'
                    }>
                      {alert.type === 'low_stock' ? 'Stok Rendah' :
                       alert.type === 'expired' ? 'Kedaluwarsa' :
                       'Akan Kedaluwarsa'}
                    </Badge>
                  </AlertDescription>
                </Alert>
              ))}
              {alerts.length > 5 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.visit(route('alerts.index'))}
                >
                  Lihat semua peringatan ({alerts.length})
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Low Stock Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stok Rendah</CardTitle>
              <CardDescription>
                Obat yang perlu segera diisi ulang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockMedications.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada obat dengan stok rendah</p>
              ) : (
                lowStockMedications.map((medication) => (
                  <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{medication.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stok: {medication.current_stock} / Min: {medication.minimum_stock}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleQuickAction('add_stock', medication.id)}
                      >
                        Tambah Stok
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Expiring Soon */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Akan Kedaluwarsa</CardTitle>
              <CardDescription>
                Obat yang akan kedaluwarsa dalam 30 hari
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {expiringSoonMedications.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada obat yang akan kedaluwarsa</p>
              ) : (
                expiringSoonMedications.map((medication) => (
                  <div key={medication.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{medication.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Kedaluwarsa: {formatDate(medication.expiry_date!)}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleQuickAction('view_medication', medication.id)}
                    >
                      Lihat Detail
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Movements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
              <CardDescription>
                Pergerakan stok terbaru
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMovements.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada aktivitas</p>
              ) : (
                recentMovements.slice(0, 5).map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {movement.type === 'incoming' ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{movement.medication.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {movement.type === 'incoming' ? '+' : '-'}{movement.quantity} - {movement.reason}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {formatDate(movement.movement_date)}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Akses cepat ke fitur-fitur utama sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.visit(route('medications.index'))}
              >
                <Package className="w-6 h-6" />
                <span>Kelola Obat</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.visit(route('stock-movements.index'))}
              >
                <Activity className="w-6 h-6" />
                <span>Pergerakan Stok</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.visit(route('reports.index'))}
              >
                <FileText className="w-6 h-6" />
                <span>Laporan</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col space-y-2"
                onClick={() => router.visit(route('alerts.index'))}
              >
                <Bell className="w-6 h-6" />
                <span>Peringatan</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}