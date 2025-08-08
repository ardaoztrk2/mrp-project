// src/pages/OrderList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'; // <<<<<<<<<< BU SATIRI EKLEYİN

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Siparişler alınamadı:", err);
      toast.error(err.response?.data?.message || "Siparişler yüklenirken hata oluştu."); // <<<<<<<<<< toast.error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // window.confirm yerine toastify ile onay mekanizması
    toast.warn(
      <div>
        <p>Bu siparişi silmek istediğinizden emin misiniz?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={() => {
              toast.dismiss(); // Toast'ı kapat
              confirmDelete(id); // Silme işlemini başlat
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Evet, Sil
          </button>
          <button
            onClick={() => toast.dismiss()} // Toast'ı kapat
            className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            İptal
          </button>
        </div>
      </div>,
      {
        closeButton: false,
        autoClose: false,
        position: "top-center",
        className: "dark:bg-gray-700 dark:text-gray-100 dark:border dark:border-gray-600",
      }
    );
  };

  const confirmDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Sipariş başarıyla silindi!"); // <<<<<<<<<< toast.success
      fetchOrders(); // Listeyi güncelle
    } catch (err) {
      console.error("Sipariş silinirken hata:", err);
      toast.error(err.response?.data?.message || "Sipariş silinirken bir hata oluştu."); // <<<<<<<<<< toast.error
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 min-h-screen">Yükleniyor...</p>;
  if (error) return <p className="p-6 text-red-500 dark:text-red-400 bg-gray-100 dark:bg-gray-900 min-h-screen">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        📋 Sipariş Listesi
      </h2>
      <Link
        to="/admin/order-add"
        className="
          inline-flex items-center gap-2
          px-4 py-2 mb-6
          bg-green-600 hover:bg-green-700
          text-white font-semibold rounded-lg
          shadow-md hover:shadow-lg
          transition-all duration-300
          dark:bg-green-700 dark:hover:bg-green-800
        "
      >
        ➕ Yeni Sipariş Ekle
      </Link>

      {orders.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Henüz hiç sipariş bulunmuyor.</p>
      ) : (
        <ul className="list-none p-0 space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="bg-white rounded-xl shadow-lg p-5 dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
              <div className="flex justify-between items-center mb-2">
                <strong className="text-xl text-gray-900 dark:text-gray-100">Sipariş ID: {order._id.substring(0, 8)}...</strong>
                <span className="text-gray-600 dark:text-gray-300">Durum: {order.status}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                Müşteri: <span className="font-semibold">{order.customerName}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                Ürün: <span className="font-semibold">{order.product?.name || 'Bilinmeyen Ürün'}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                Miktar: <span className="font-semibold">{order.quantity} {order.product?.unit || ''}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                Sipariş Tarihi: <span className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</span>
              </p>

              <div className="mt-4 flex justify-end space-x-2">
                <Link
                  to={`/admin/order-edit/${order._id}`}
                  className="
                    inline-flex items-center gap-1
                    px-4 py-2
                    text-sm font-semibold
                    text-white
                    bg-blue-600 hover:bg-blue-700
                    rounded-lg
                    transition-colors duration-200
                    shadow-sm
                    dark:bg-blue-700 dark:hover:bg-blue-800
                  "
                >
                  ✏️ Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="
                    inline-flex items-center gap-1
                    px-4 py-2
                    text-sm font-semibold
                    text-white
                    bg-red-600 hover:bg-red-700
                    rounded-lg
                    transition-colors duration-200
                    shadow-sm
                    dark:bg-red-700 dark:hover:bg-red-800
                  "
                >
                  🗑️ Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderList;
