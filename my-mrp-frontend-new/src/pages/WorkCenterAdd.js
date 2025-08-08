// src/pages/WorkCenterAdd.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

function WorkCenterAdd() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    capacity: "",
    capacityUnit: "saat/gün", // Varsayılan değer
    machineCount: 0,
    personnelCount: 0,
    isActive: true, // Varsayılan olarak aktif
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/workcenters", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("İş merkezi başarıyla eklendi!");
      navigate("/admin/workcenters"); // İş merkezleri listesine geri dön
    } catch (err) {
      console.error("İş merkezi eklenirken hata:", err);
      toast.error(err.response?.data?.message || "İş merkezi eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100">
        ➕ Yeni İş Merkezi Ekle
      </h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              İş Merkezi Adı:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              İş Merkezi Kodu:
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Açıklama (İsteğe Bağlı):
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                       dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Kapasite:
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="0"
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="capacityUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Kapasite Birimi:
            </label>
            <select
              id="capacityUnit"
              name="capacityUnit"
              value={formData.capacityUnit}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value="saat/gün">saat/gün</option>
              <option value="adet/gün">adet/gün</option>
              <option value="saat/hafta">saat/hafta</option>
              <option value="adet/hafta">adet/hafta</option>
              <option value="dakika/ürün">dakika/ürün</option>
              <option value="saat/ürün">saat/ürün</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="machineCount" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Makine Sayısı:
            </label>
            <input
              type="number"
              id="machineCount"
              name="machineCount"
              value={formData.machineCount}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
          <div>
            <label htmlFor="personnelCount" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Personel Sayısı:
            </label>
            <input
              type="number"
              id="personnelCount"
              name="personnelCount"
              value={formData.personnelCount}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Aktif
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex items-center gap-2
              px-4 py-2
              bg-blue-600 hover:bg-blue-700
              text-white font-semibold rounded-lg
              shadow-md hover:shadow-lg
              transition-all duration-300
              dark:bg-blue-700 dark:hover:bg-blue-800
              text-base
            "
          >
            {loading ? "Ekleniyor..." : "İş Merkezi Ekle"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/workcenters")}
            className="
              inline-flex items-center gap-2
              px-4 py-2
              bg-gray-300 hover:bg-gray-400
              text-gray-800 font-semibold rounded-lg
              shadow-md hover:shadow-lg
              transition-all duration-300
              dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-100
              text-base
            "
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}

export default WorkCenterAdd;
