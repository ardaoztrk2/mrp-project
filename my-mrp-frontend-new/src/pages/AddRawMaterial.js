// src/pages/AddRawMaterial.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function AddRawMaterial() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [newRawMaterial, setNewRawMaterial] = useState({
    name: "",
    currentStock: 0, // <-- DÜZELTİLDİ
    unit: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRawMaterials = async () => {
    setFetchLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/rawmaterials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRawMaterials(res.data);
    } catch (err) {
      console.error("Hammaddeler alınırken hata:", err);
      toast.error(
        err.response?.data?.message || "Hammaddeler yüklenirken bir hata oluştu."
      );
      setError(
        err.response?.data?.message || "Hammaddeler yüklenirken bir hata oluştu."
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRawMaterial({
      ...newRawMaterial,
      [name]: name === "currentStock" ? Number(value) : value, // <-- DÜZELTİLDİ
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !newRawMaterial.name ||
      !newRawMaterial.unit ||
      newRawMaterial.currentStock < 0 // <-- DÜZELTİLDİ
    ) {
      toast.error("Lütfen tüm alanları doğru şekilde doldurun.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/rawmaterials", newRawMaterial, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Hammadde başarıyla eklendi!");
      setNewRawMaterial({ name: "", currentStock: 0, unit: "" }); // <-- DÜZELTİLDİ
      fetchRawMaterials();
    } catch (err) {
      console.error("Hammadde eklenirken hata:", err);
      toast.error(
        err.response?.data?.message || "Hammadde eklenirken bir hata oluştu."
      );
      setError(
        err.response?.data?.message || "Hammadde eklenirken bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu hammaddeyi silmek istediğinizden emin misiniz?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/rawmaterials/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Hammadde başarıyla silindi!");
        fetchRawMaterials();
      } catch (err) {
        console.error("Hammadde silinirken hata:", err);
        toast.error(
          err.response?.data?.message || "Hammadde silinirken bir hata oluştu."
        );
      }
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        📦 Hammadde Yönetimi
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300 max-w-md mx-auto mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Yeni Hammadde Ekle
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
              Ad:
            </label>
            <input
              type="text"
              name="name"
              value={newRawMaterial.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
              Stok:
            </label>
            <input
              type="number"
              name="currentStock" // <-- DÜZELTİLDİ
              value={newRawMaterial.currentStock} // <-- DÜZELTİLDİ
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
              Birim:
            </label>
            <input
              type="text"
              name="unit"
              value={newRawMaterial.unit}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              required
            />
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
            {loading ? "Ekleniyor..." : "Hammadde Ekle"}
          </button>
        </form>
      </div>

      <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Mevcut Hammaddeler
      </h3>
      {fetchLoading ? (
        <p className="text-gray-600 dark:text-gray-300">
          Hammaddeler yükleniyor...
        </p>
      ) : rawMaterials.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          Henüz hiç hammadde bulunmuyor.
        </p>
      ) : (
        <ul className="list-none p-0 space-y-4">
          {rawMaterials.map((rm) => (
            <li
              key={rm._id}
              className="bg-white rounded-xl shadow-lg p-4 md:p-5 dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div className="flex-grow mb-2 sm:mb-0">
                <strong className="text-lg md:text-xl text-gray-900 dark:text-gray-100">
                  {rm.name}
                </strong>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-200">
                  Stok:{" "}
                  <span className="font-semibold">
                    {rm.currentStock} {rm.unit}
                  </span>{" "}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/admin/rawmaterials/edit/${rm._id}`}
                  className="
                    inline-flex items-center gap-1
                    px-3 py-1 md:px-4 md:py-2
                    text-xs md:text-sm font-semibold
                    text-white
                    bg-yellow-500 hover:bg-yellow-600
                    rounded-lg
                    transition-colors duration-200
                    shadow-sm
                    dark:bg-yellow-600 dark:hover:bg-yellow-700
                  "
                >
                  ✏️ Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(rm._id)}
                  className="
                    inline-flex items-center gap-1
                    px-3 py-1 md:px-4 md:py-2
                    text-xs md:text-sm font-semibold
                    text-white
                    bg-red-500 hover:bg-red-600
                    rounded-lg
                    transition-colors duration-200
                    shadow-sm
                    dark:bg-red-600 dark:hover:bg-red-700
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

export default AddRawMaterial;
