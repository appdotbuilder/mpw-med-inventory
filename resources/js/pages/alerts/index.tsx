import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { router } from '@inertiajs/react';
import { Bell, Calendar, Package, CheckCircle, Eye } from 'lucide-react';

interface StockAlert {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
  medication: {
    id: number;
    name: string;
    current_stock: number;
    minimum_stock: number;
    expiry_date?: string;
  };
}

interface PaginatedAlerts {
  data: StockAlert[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  alerts: PaginatedAlerts;
  filters: {
    type?: string;
    status?: string;
  };
  [key: string]: unknown;
}

export default function AlertsIndex({ alerts, filters }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMarkAsRead = (alertId: number) => {
    router.post(route('alerts.store'), {
      alert_id: alertId,
      action: 'mark_read'
    }, {
      preserveScroll: true,
    });
  };

  const handleResolve = (alertId: number) => {
    router.post(route('alerts.store'), {
      alert_id: alertId,
      action: 'resolve'
    }, {
      preserveScroll: true,
    });
  };

  const handleFilter = (key: string, value: string) => {
    router.get(route('alerts.index'), { ...filters, [key]: value }, {
      preserveScroll: true,
      replace: true,
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Package className="w-5 h-5" />;
      case 'expired':
        return <Calendar className="w-5 h-5" />;
      case 'expiring_soon':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'border-orange-200 bg-orange-50';
      case 'expired':
        return 'border-red-200 bg-red-50';
      case 'expiring_soon':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Badge variant="secondary">Stok Rendah</Badge>;
      case 'expired':
        return <Badge variant="destructive">Kedaluwarsa</Badge>;
      case 'expiring_soon':
        return <Badge variant="outline">Akan Kedaluwarsa</Badge>;
      default:
        return <Badge>Lainnya</Badge>;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading>🔔 Peringatan Sistem</Heading>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Peringatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={!filters.type ? 'default' : 'outline'}
                onClick={() => handleFilter('type', '')}
              >
                Semua Jenis
              </Button>
              <Button 
                variant={filters.type === 'low_stock' ? 'default' : 'outline'}
                onClick={() => handleFilter('type', 'low_stock')}
              >
                Stok Rendah
              </Button>
              <Button 
                variant={filters.type === 'expired' ? 'default' : 'outline'}
                onClick={() => handleFilter('type', 'expired')}
              >
                Kedaluwarsa
              </Button>
              <Button 
                variant={filters.type === 'expiring_soon' ? 'default' : 'outline'}
                onClick={() => handleFilter('type', 'expiring_soon')}
              >
                Akan Kedaluwarsa
              </Button>
              
              <div className="border-l border-gray-300 mx-2"></div>
              
              <Button 
                variant={filters.status === 'unread' ? 'default' : 'outline'}
                onClick={() => handleFilter('status', 'unread')}
              >
                Belum Dibaca
              </Button>
              <Button 
                variant={filters.status === 'unresolved' ? 'default' : 'outline'}
                onClick={() => handleFilter('status', 'unresolved')}
              >
                Belum Diselesaikan
              </Button>
              <Button 
                variant={filters.status === 'resolved' ? 'default' : 'outline'}
                onClick={() => handleFilter('status', 'resolved')}
              >
                Sudah Diselesaikan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        {alerts.data.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada peringatan</h3>
              <p className="text-gray-500">Semua sistem berjalan dengan baik</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.data.map((alert) => (
              <Alert key={alert.id} className={`${getAlertColor(alert.type)} ${!alert.is_read ? 'ring-2 ring-blue-200' : ''}`}>
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">{alert.medication.name}</span>
                          {getTypeBadge(alert.type)}
                          {!alert.is_read && (
                            <Badge className="bg-blue-100 text-blue-800">Baru</Badge>
                          )}
                          {alert.is_resolved && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Selesai
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-3">{alert.message}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatDate(alert.created_at)}</span>
                          {alert.type === 'low_stock' && (
                            <span>
                              Stok: {alert.medication.current_stock} / Min: {alert.medication.minimum_stock}
                            </span>
                          )}
                          {alert.medication.expiry_date && alert.type !== 'low_stock' && (
                            <span>
                              Kedaluwarsa: {new Date(alert.medication.expiry_date).toLocaleDateString('id-ID')}
                            </span>
                          )}
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.visit(route('medications.show', alert.medication.id))}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat Obat
                    </Button>
                    
                    {!alert.is_read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        Tandai Dibaca
                      </Button>
                    )}
                    
                    {!alert.is_resolved && (
                      <Button
                        size="sm"
                        onClick={() => handleResolve(alert.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Selesaikan
                      </Button>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan Peringatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{alerts.total}</div>
                <div className="text-sm text-gray-500">Total Peringatan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {alerts.data.filter(a => a.type === 'low_stock' && !a.is_resolved).length}
                </div>
                <div className="text-sm text-gray-500">Stok Rendah</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {alerts.data.filter(a => a.type === 'expired' && !a.is_resolved).length}
                </div>
                <div className="text-sm text-gray-500">Kedaluwarsa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {alerts.data.filter(a => a.type === 'expiring_soon' && !a.is_resolved).length}
                </div>
                <div className="text-sm text-gray-500">Akan Kedaluwarsa</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {alerts.last_page > 1 && (
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <div className="text-sm text-gray-500">
                Menampilkan {((alerts.current_page - 1) * alerts.per_page) + 1} - {Math.min(alerts.current_page * alerts.per_page, alerts.total)} dari {alerts.total} peringatan
              </div>
              <div className="flex gap-2">
                {alerts.current_page > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.get(route('alerts.index'), { ...filters, page: alerts.current_page - 1 })}
                  >
                    Sebelumnya
                  </Button>
                )}
                {alerts.current_page < alerts.last_page && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.get(route('alerts.index'), { ...filters, page: alerts.current_page + 1 })}
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