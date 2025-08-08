// src/components/StockMovementList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // toast bildirimleri için
import { useNavigate } from 'react-router-dom'; // Yeni stok hareketi ekleme sayfasına yönlendirme için

// Fiş görüntüleme için modal bileşenini import edin
import StockMovementSlipModal from './StockMovementSlipModal'; 

const StockMovementList = () => {
    const [stockMovements, setStockMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMovement, setSelectedMovement] = useState(null); // Fişini görüntülemek için seçilen hareket
    const [isModalOpen, setIsModalOpen] = useState(false); // Modalın açık olup olmadığını kontrol eder

    const navigate = useNavigate(); // useNavigate hook'unu kullanın

    useEffect(() => {
        fetchStockMovements();
    }, []); // Boş dizi, component ilk yüklendiğinde bir kez çalışmasını sağlar

    const fetchStockMovements = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { // Token yoksa kullanıcıyı login sayfasına yönlendir
                toast.error("Giriş yapmanız gerekiyor. Lütfen giriş yapın.");
                navigate('/login');
                setLoading(false); // Yükleme durumunu kapat
                return; // Fonksiyonu burada sonlandır
            }

            // Backend'deki stok hareketleri API'nize GET isteği gönderin
            // Token'ı Authorization header'ı olarak eklediğimizden emin olalım
            const response = await axios.get('http://localhost:5000/api/stock-movements', {
                headers: { 'Authorization': `Bearer ${token}` } // <-- BURASI DÜZELTİLDİ
            });
            setStockMovements(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Stok hareketleri yüklenirken bir hata oluştu:', err);
            setError('Stok hareketleri yüklenirken bir hata oluştu: ' + (err.response?.data?.message || err.message));
            setLoading(false);
            toast.error('Stok hareketleri yüklenirken bir sorun oluştu!');
            
            // Eğer hata 401 ise (Unauthorized), kullanıcıyı login sayfasına yönlendir
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        }
    };

    // Yeni stok hareketi ekleme sayfasına yönlendirme fonksiyonu
    const handleAddMovement = () => {
        navigate('/stock-movements/add');
    };

    // Fişi görüntüleme butonu tıklandığında
    const handleViewSlip = (movement) => {
        setSelectedMovement(movement);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMovement(null);
    };

    if (loading) {
        return <div className="text-center p-4 dark:text-gray-300">Stok hareketleri yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Stok Hareketleri Listesi</h2>

            {/* Yeni Stok Hareketi Ekle butonu */}
            <button
                onClick={handleAddMovement}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 transition duration-300"
            >
                Yeni Stok Hareketi Ekle
            </button>

            {stockMovements.length === 0 ? (
                <p className="text-gray-400">Henüz hiç stok hareketi bulunmuyor.</p>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-gray-800 border border-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                                    Materyal Adı
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                                    Materyal Tipi
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                                    Hareket Tipi
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                                    Miktar
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                                    Birim
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                                    Tarih
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                                    Notlar
                                </th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-600">
                                    İşlemler
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {stockMovements.map((movement) => (
                                <tr key={movement._id} className="hover:bg-gray-700 transition duration-150">
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-200">
                                        {movement.materialName || 'Bilinmiyor'} {/* Backend'den materialName geldiğini varsayıyoruz */}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-200">
                                        {movement.materialType === 'Product' ? 'Ürün' : 'Hammadde'}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-200">
                                        {movement.movementType === 'in' ? 'Giriş' : 'Çıkış'}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-200">
                                        {movement.quantity}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-200">
                                        {movement.unit || '-'} {/* Birim bilgisini göster */}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-200">
                                        {new Date(movement.date).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-200">
                                        {movement.notes || '-'}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewSlip(movement)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs transition duration-300"
                                        >
                                            Fişi Görüntüle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Fiş Görüntüleme Modalı */}
            {isModalOpen && selectedMovement && (
                <StockMovementSlipModal movement={selectedMovement} onClose={closeModal} />
            )}
        </div>
    );
};

export default StockMovementList;