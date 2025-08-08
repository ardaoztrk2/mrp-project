// src/pages/OrderAdd.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

function OrderAdd() {
  const [formData, setFormData] = useState({
    customerName: "",
    productId: "", // Başlangıçta boş string
    quantity: 0,
    orderDate: new Date().toISOString().split('T')[0],
    status: "pending",
  });
  const [productsOptions, setProductsOptions] = useState([]);
  const [selectedProductRawMaterials, setSelectedProductRawMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductsOptions(res.data);
      } catch (err) {
        console.error("Ürün seçenekleri alınamadı:", err);
        toast.error("Ürün seçenekleri yüklenirken hata oluştu.");
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (formData.productId) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`http://localhost:5000/api/products/${formData.productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const rawMaterialsData = res.data.rawMaterials || [];
          setSelectedProductRawMaterials(
            rawMaterialsData.map(rm => ({
              rawMaterial: rm.rawMaterial._id,
              name: rm.rawMaterial.name,
              unit: rm.rawMaterial.unit,
              quantity: rm.quantity,
            }))
          );
        } catch (err) {
          console.error("Ürün detayları alınamadı:", err);
          toast.error("Seçilen ürünün hammaddeleri yüklenirken hata oluştu.");
          setSelectedProductRawMaterials([]);
        }
      } else {
        setSelectedProductRawMaterials([]);
      }
    };
    fetchProductDetails();
  }, [formData.productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: name === 'quantity' ? Number(value) : value 
    }));
    if (name === 'productId') {
        setSelectedProductRawMaterials([]);
    }
  };

  const handleRawMaterialQuantityChange = (rawMaterialId, newQuantity) => {
    setSelectedProductRawMaterials(prevMaterials =>
      prevMaterials.map(rm =>
        rm.rawMaterial === rawMaterialId
          ? { ...rm, quantity: Math.max(0, Number(newQuantity)) }
          : rm
      )
    );
  };

  const handleRemoveRawMaterial = (rawMaterialId) => {
    setSelectedProductRawMaterials(prevMaterials =>
      prevMaterials.filter(rm => rm.rawMaterial !== rawMaterialId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      const customMaterialsToSend = selectedProductRawMaterials.map(rm => ({
        rawMaterial: rm.rawMaterial,
        quantity: rm.quantity,
      }));

      // ✅ productId -> product olarak backend'e gönderiyoruz
      const dataToSend = {
        customerName: formData.customerName,
        product: formData.productId,  // DEĞİŞİKLİK BURADA!
        quantity: formData.quantity,
        orderDate: formData.orderDate,
        status: formData.status,
        customRawMaterials: customMaterialsToSend,
      };

      console.log("Frontend - Data to Send:", dataToSend);

      await axios.post("http://localhost:5000/api/orders", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Sipariş başarıyla eklendi!");
      setFormData({
        customerName: "",
        productId: "",
        quantity: 0,
        orderDate: new Date().toISOString().split('T')[0],
        status: "pending",
      });
      setSelectedProductRawMaterials([]);
    } catch (err) {
      console.error("Sipariş eklenirken hata:", err);
      toast.error(err.response?.data?.message || "Sipariş eklenirken bir hata oluştu.");
      setError(err.response?.data?.message || "Sipariş eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        ➕ Yeni Sipariş Ekle
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

        {formData.productId && selectedProductRawMaterials.length > 0 && (
          <div className="mb-6 border rounded-xl p-4 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Ürün Hammaddelerini Özelleştir:
            </h3>
            {selectedProductRawMaterials.map((rm) => (
              <div key={rm.rawMaterial} className="flex items-center justify-between gap-2 py-2 border-b last:border-b-0 dark:border-gray-700">
                <span className="text-gray-700 dark:text-gray-200 flex-grow">
                  {rm.name} ({rm.unit})
                </span>
                <input
                  type="number"
                  value={rm.quantity}
                  onChange={(e) => handleRawMaterialQuantityChange(rm.rawMaterial, e.target.value)}
                  className="w-20 p-1 border rounded text-center text-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  min="0"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRawMaterial(rm.rawMaterial)}
                  className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                  title="Hammaddeyi Kaldır"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 6h6v10H7V6z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Miktar:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            required
            min="1"
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
            w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded
            focus:outline-none focus:shadow-outline transition-colors duration-200
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
            dark:bg-green-600 dark:hover:bg-green-800
          `}
        >
          {loading ? "Ekleniyor..." : "Sipariş Ekle"}
        </button>
      </form>
    </div>
  );
}

export default OrderAdd;
