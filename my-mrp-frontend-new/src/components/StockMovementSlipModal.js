// src/components/StockMovementSlipModal.js
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print'; 
import { toast } from 'react-toastify';

const StockMovementSlipModal = ({ movement, onClose }) => {
    const componentRef = useRef(); // Yazdırılacak content'i referanslamak için

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Stok_Fisi_${movement._id}`,
        onAfterPrint: () => toast.success('Fiş yazdırıldı veya PDF oluşturuldu!'), // İsteğe bağlı
    });

    if (!movement) return null; // Hareket bilgisi yoksa bir şey gösterme

    // Tarihi daha okunabilir formata çevir
    const formattedDate = new Date(movement.date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative text-white">
                {/* Kapat butonu */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
                    aria-label="Kapat"
                >
                    &times;
                </button>

                {/* Fiş içeriği (Yazdırılacak kısım) */}
                <div ref={componentRef} className="p-6 bg-white text-gray-900 rounded-md">
                    <h3 className="text-2xl font-bold mb-4 text-center text-blue-700">Stok Hareketi Fişi</h3>
                    <hr className="mb-4 border-blue-200" />

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p><strong className="text-gray-700">Fiş ID:</strong> {movement._id}</p>
                            <p><strong className="text-gray-700">Hareket Tipi:</strong> <span className={`font-semibold ${movement.movementType === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                                {movement.movementType === 'in' ? 'Giriş' : 'Çıkış'}
                            </span></p>
                            <p><strong className="text-gray-700">Tarih:</strong> {formattedDate}</p>
                        </div>
                        <div>
                            <p><strong className="text-gray-700">Malzeme Adı:</strong> {movement.materialName}</p>
                            <p><strong className="text-gray-700">Malzeme Tipi:</strong> {movement.materialType === 'Product' ? 'Ürün' : 'Hammadde'}</p>
                            <p><strong className="text-gray-700">Miktar:</strong> {movement.quantity} {movement.unit}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <strong className="text-gray-700">Notlar:</strong> {movement.notes || '-'}
                    </div>

                    <p className="text-sm text-gray-600 mt-6 text-center">
                        Bu belge MRP Yönetim Sistemi tarafından otomatik olarak oluşturulmuştur.
                    </p>
                </div>

                {/* Yazdırma butonu */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={handlePrint}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4V2a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zm0 10V6h10v8H5zm0-8h10V6H5v2z" clipRule="evenodd"></path></svg>
                        Fişi Yazdır / PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StockMovementSlipModal;