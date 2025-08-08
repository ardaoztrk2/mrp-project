// src/pages/MrpReport.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useTheme } from '../contexts/ThemeContext';

const API_BASE_URL = "http://localhost:5000/api";

function MrpReport() {
    const [mrpData, setMrpData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [error, setError] = useState("");
    const { theme } = useTheme();

    const fetchMrpReport = async () => {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE_URL}/mrp/report`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMrpData(res.data);
            console.log("Fetched MRP Data:", res.data);
        } catch (err) {
            console.error("❌ MRP Raporu alınamadı:", err);
            setError(err.response?.data?.message || "MRP raporu yüklenirken bir hata oluştu.");
            toast.error("MRP raporu yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMrpReport();
    }, []);

    const handleCreatePurchaseOrders = async () => {
        setIsCreatingOrder(true);
        setError("");

        // Eksik miktarı olan hammaddeleri filtrele
        const missingItemsToSend = mrpData
            .filter(item => item.missingQuantity > 0)
            .map(item => ({
                rawMaterialId: item.rawMaterialId,
                missingQuantity: item.missingQuantity
            }));

        // Eğer eksik hammadde yoksa işlemi durdur
        if (missingItemsToSend.length === 0) {
            toast.info("Satın alma siparişi oluşturulacak eksik hammadde bulunmamaktadır.");
            setIsCreatingOrder(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_BASE_URL}/mrp/create-purchase-orders`,
                missingItemsToSend,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success(response.data.message);
            // Satın alma siparişleri oluşturulduktan sonra raporu yenile
            await fetchMrpReport();
        } catch (err) {
            console.error("❌ Satınalma siparişi oluşturulurken hata oluştu:", err);
            setError(err.response?.data?.message || "Satınalma siparişi oluşturulurken bir hata oluştu.");
            toast.error(err.response?.data?.message || "Satınalma siparişi oluşturulurken bir hata oluştu.");
        } finally {
            setIsCreatingOrder(false);
        }
    };

    if (loading) return <p className="p-4 md:p-6 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 min-h-screen">Yükleniyor...</p>;
    if (error) return <p className="p-4 md:p-6 text-red-500 dark:text-red-400 bg-gray-100 dark:bg-gray-900 min-h-screen">{error}</p>;

    // Eksik miktar olup olmadığını kontrol et
    const hasMissingQuantity = mrpData.some(item => item.missingQuantity > 0);

    return (
        <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                📊 Malzeme İhtiyaç Planlama (MRP) Raporu
            </h2>

            {mrpData.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                    Bekleyen veya üretimdeki siparişler için hammadde ihtiyacı bulunmuyor.
                </p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:shadow-xl transition-colors duration-300">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Hammadde Adı</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Gerekli Miktar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Mevcut Stok</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Eksik Miktar</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Birim</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {mrpData.map((item) => (
                                <tr key={item.rawMaterialId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.rawMaterialName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.requiredQuantity.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.currentStock.toFixed(2)}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.missingQuantity > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{item.missingQuantity.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {hasMissingQuantity && (
                <button
                    onClick={handleCreatePurchaseOrders}
                    disabled={isCreatingOrder}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    {isCreatingOrder ? 'Siparişler Oluşturuluyor...' : 'Eksik Hammaddeleri Satınal'}
                </button>
            )}

            {!hasMissingQuantity && !loading && mrpData.length > 0 && (
                <p className="mt-6 text-gray-600 dark:text-gray-300">Tüm hammaddeler yeterli seviyede.</p>
            )}
        </div>
    );
}

export default MrpReport;
