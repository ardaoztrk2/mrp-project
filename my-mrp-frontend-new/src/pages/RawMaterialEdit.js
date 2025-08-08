// src/pages/RawMaterialEdit.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function RawMaterialEdit() {
  const { id } = useParams(); // URL'den hammadde ID'sini al
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    currentStock: 0, // <-- DÜZELTİLDİ: "currentStock" olarak değiştirildi
    unit: "",
  });
  const [loading, setLoading] = useState(true); // Veri yüklenirken
  const [submitting, setSubmitting] = useState(false); // Form gönderilirken
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRawMaterial = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/rawmaterials/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Backend'den gelen 'currentStock' verisini doğru şekilde state'e atıyoruz
        setFormData(res.data);
      } catch (err) {
        console.error("Hammadde bilgileri alınamadı:", err);
        toast.error(err.response?.data?.message || "Hammadde bilgileri yüklenirken hata oluştu.");
        setError(err.response?.data?.message || "Hammadde bilgileri yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchRawMaterial();
  }, [id]); // ID değiştiğinde bu efekti yeniden çalıştır

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      // DÜZELTİLDİ: "stock" yerine "currentStock" kontrolü yapılıyor
      [name]: name === "currentStock" ? Number(value) : value, 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // DÜZELTİLDİ: "formData.stock" yerine "formData.currentStock" kontrolü yapılıyor
    if (!formData.name || !formData.unit || formData.currentStock < 0) {
      toast.error("Lütfen tüm alanları doğru şekilde doldurun.");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // formData objesi otomatik olarak doğru 'currentStock' alanını gönderecek
      await axios.put(`http://localhost:5000/api/rawmaterials/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Hammadde başarıyla güncellendi!");
      navigate("/admin/rawmaterials"); // Hammadde listesi sayfasına geri dön
    } catch (err) {
      console.error("Hammadde güncellenirken hata:", err);
      toast.error(err.response?.data?.message || "Hammadde güncellenirken bir hata oluştu.");
      setError(err.response?.data?.message || "Hammadde güncellenirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 text-gray-800 dark:text-gray-200">Hammadde bilgileri yükleniyor...</p>;
  }

  if (error) {
    return <p className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        ✏️ Hammaddeyi Düzenle
      </h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300 max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Ad:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Stok:</label>
          <input
            type="number"
            name="currentStock" // <-- DÜZELTİLDİ: "currentStock" olarak değiştirildi
            value={formData.currentStock} // <-- DÜZELTİLDİ: "currentStock" olarak değiştirildi
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            required
            min="0"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Birim:</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={`
            w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            focus:outline-none focus:shadow-outline transition-colors duration-200
            ${submitting ? "opacity-50 cursor-not-allowed" : ""}
            dark:bg-blue-600 dark:hover:bg-blue-800
          `}
        >
          {submitting ? "Güncelleniyor..." : "Hammaddeyi Güncelle"}
        </button>
      </form>
    </div>
  );
}

export default RawMaterialEdit;
