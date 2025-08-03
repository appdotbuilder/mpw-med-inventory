import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Package, Shield, BarChart3, Bell, FileText, Activity } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: Package,
            title: 'Manajemen Obat',
            description: 'Kelola data obat lengkap dengan informasi batch, kedaluwarsa, dan harga'
        },
        {
            icon: Activity,
            title: 'Tracking Stok Real-time',
            description: 'Pantau pergerakan stok masuk dan keluar secara real-time'
        },
        {
            icon: Bell,
            title: 'Sistem Peringatan',
            description: 'Alert otomatis untuk stok rendah dan obat yang akan kedaluwarsa'
        },
        {
            icon: BarChart3,
            title: 'Laporan Komprehensif',
            description: 'Generate laporan penggunaan obat dan status inventori'
        },
        {
            icon: Shield,
            title: 'Kontrol Akses Berlapis',
            description: 'Role-based access untuk Administrator dan User biasa'
        },
        {
            icon: FileText,
            title: 'Audit Trail Lengkap',
            description: 'Riwayat lengkap semua transaksi untuk kepatuhan regulasi'
        }
    ];

    return (
        <>
            <Head title="Sistem Inventori Obat - Kementerian PUPR" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
                {/* Header */}
                <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900">MedInventory</h1>
                                    <p className="text-xs text-gray-600">Kementerian PUPR</p>
                                </div>
                            </div>
                            
                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                        📊 Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex space-x-3">
                                        <Link
                                            href={route('login')}
                                            className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
                                        >
                                            Daftar
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <div className="mb-8">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    🏥 Sistem Resmi Kementerian Pekerjaan Umum dan Perumahan Rakyat
                                </span>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                💊 <span className="text-blue-600">Sistem Inventori Obat</span>
                                <br />
                                <span className="text-3xl md:text-4xl text-gray-700">untuk Klinik PUPR</span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Platform terintegrasi untuk mengelola inventori obat dengan sistem tracking real-time, 
                                kontrol akses berlapis, dan laporan komprehensif yang sesuai standar regulasi Indonesia.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                {!auth.user && (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                        >
                                            🚀 Mulai Sekarang
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200"
                                        >
                                            👤 Login Sistem
                                        </Link>
                                    </>
                                )}
                                {auth.user && (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                    >
                                        📊 Akses Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                ✨ Fitur Unggulan Sistem
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Dilengkapi dengan teknologi modern untuk memastikan efisiensi dan kepatuhan terhadap regulasi
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div 
                                    key={index}
                                    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2"
                                >
                                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                        <feature.icon className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                📈 Sistem yang Terpercaya
                            </h2>
                            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                                Mendukung operasional klinik di seluruh Indonesia dengan standar keamanan tinggi
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                                <div className="text-blue-100">Uptime Sistem</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                <div className="text-4xl font-bold text-white mb-2">24/7</div>
                                <div className="text-blue-100">Monitoring</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                <div className="text-4xl font-bold text-white mb-2">256-bit</div>
                                <div className="text-blue-100">Enkripsi SSL</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                                <div className="text-4xl font-bold text-white mb-2">ISO</div>
                                <div className="text-blue-100">Certified</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-3xl shadow-2xl p-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                🏥 Siap Modernisasi Inventori Obat Anda?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Bergabunglah dengan sistem yang telah dipercaya oleh berbagai klinik 
                                Kementerian PUPR untuk mengelola inventori obat secara efisien dan akurat.
                            </p>
                            
                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route('register')}
                                        className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg"
                                    >
                                        🆕 Buat Akun Baru
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200"
                                    >
                                        👨‍⚕️ Login Staff
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">MedInventory</h3>
                                        <p className="text-sm text-gray-400">Kementerian PUPR</p>
                                    </div>
                                </div>
                                <p className="text-gray-400">
                                    Sistem inventori obat resmi untuk mendukung pelayanan kesehatan 
                                    di lingkungan Kementerian Pekerjaan Umum dan Perumahan Rakyat.
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Fitur Utama</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>• Manajemen Stok Real-time</li>
                                    <li>• Sistem Peringatan Otomatis</li>
                                    <li>• Laporan Komprehensif</li>
                                    <li>• Kontrol Akses Berlapis</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold mb-4">Keamanan</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>• Enkripsi End-to-End</li>
                                    <li>• Audit Trail Lengkap</li>
                                    <li>• Backup Otomatis</li>
                                    <li>• Sertifikasi ISO 27001</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 Kementerian Pekerjaan Umum dan Perumahan Rakyat. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}