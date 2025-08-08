// src/pages/OrderEdit.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'; // <<<<<<<<<< BU SATIRI EKLEYİN

function OrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    productId: "",
    quantity: 0,
    orderDate: "",
    status: "",
  });
  const [productsOptions, setProductsOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orderData = {
          ...res.data,
          orderDate: res.data.orderDate.split('T')[0],
        };
        setFormData(orderData);
      } catch (err) {
        console.error("Sipariş bilgileri alınamadı:", err);
        toast.error("Sipariş bilgileri yüklenirken hata oluştu."); // <<<<<<<<<< toast.error
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductsOptions(res.data);
      } catch (err) {
        console.error("Ürün seçenekleri alınamadı:", err);
        toast.error("Ürün seçenekleri yüklenirken hata oluştu."); // <<<<<<<<<< toast.error
      }
    };

    fetchOrder();
    fetchProducts();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/orders/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Sipariş başarıyla güncellendi!"); // <<<<<<<<<< toast.success
      navigate("/admin/orders");
    } catch (err) {
      console.error("Sipariş güncellenirken hata:", err);
      toast.error(err.response?.data?.message || "Sipariş güncellenirken bir hata oluştu."); // <<<<<<<<<< toast.error
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 min-h-screen">Yükleniyor...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        ✏️ Sipariş Düzenle
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300 max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Müşteri Adı:</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Ürün Seçin:</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            required
          >
            <option value="">Ürün Seçin</option>
            {productsOptions.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} ({product.code})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Miktar:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Sipariş Tarihi:</label>
          <input
            type="date"
            name="orderDate"
            value={formData.orderDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Durum:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            required
          >
            <option value="pending">Beklemede</option>
            <option value="shipped">Üretimde</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            focus:outline-none focus:shadow-outline transition-colors duration-200
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
            dark:bg-blue-600 dark:hover:bg-blue-800
          `}
        >
          {loading ? "Güncelleniyor..." : "Siparişi Güncelle"}
        </button>
      </form>
    </div>
  );
}

export default OrderEdit;
