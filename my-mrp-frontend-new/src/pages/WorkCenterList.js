// src/pages/WorkCenterList.js
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

function WorkCenterList() {
  const [workCenters, setWorkCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchWorkCenters = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/workcenters", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkCenters(res.data);
    } catch (err) {
      console.error("İş merkezleri alınırken hata:", err);
      toast.error(err.response?.data?.message || "İş merkezleri yüklenirken bir hata oluştu.");
      setError(err.response?.data?.message || "İş merkezleri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkCenters();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bu iş merkezini silmek istediğinizden emin misiniz?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/workcenters/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("İş merkezi başarıyla silindi!");
        fetchWorkCenters(); // Listeyi güncelle
      } catch (err) {
        console.error("İş merkezi silinirken hata:", err);
        toast.error(err.response?.data?.message || "İş merkezi silinirken bir hata oluştu.");
      }
    }
  };

  const filteredAndSortedWorkCenters = useMemo(() => {
    let filtered = workCenters;

    if (searchTerm) {
      filtered = workCenters.filter(wc =>
        wc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (wc.description && wc.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
      return 0; // Diğer tipler için sıralama yapma
    });
  }, [workCenters, searchTerm, sortKey, sortDirection]);

  if (loading) {
    return <p className="p-6 text-gray-800 dark:text-gray-200">İş merkezleri yükleniyor...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">Hata: {error}</p>;
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        ⚙️ İş Merkezi Yönetimi
      </h2>

      <Link
        to="/admin/workcenters/add"
        className="
          inline-flex items-center gap-2
          px-3 py-2 md:px-4 md:py-2 mb-4 md:mb-6
          bg-green-600 hover:bg-green-700
          text-white font-semibold rounded-lg
          shadow-md hover:shadow-lg
          transition-all duration-300
          dark:bg-green-700 dark:hover:bg-green-800
          text-sm md:text-base
        "
      >
        ➕ Yeni İş Merkezi Ekle
      </Link>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="İş merkezi adı veya kodu ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
        />

        <select
          value={`${sortKey}-${sortDirection}`}
          onChange={(e) => {
            const [key, direction] = e.target.value.split('-');
            setSortKey(key);
            setSortDirection(direction);
          }}
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        >
          <option value="name-asc">Ad (A-Z)</option>
          <option value="name-desc">Ad (Z-A)</option>
          <option value="code-asc">Kod (A-Z)</option>
          <option value="code-desc">Kod (Z-A)</option>
          <option value="capacity-asc">Kapasite (Azalan)</option>
          <option value="capacity-desc">Kapasite (Artan)</option>
        </select>
      </div>

      {filteredAndSortedWorkCenters.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
          {searchTerm ? "Aradığınız kriterlere uygun iş merkezi bulunmuyor." : "Henüz hiç iş merkezi bulunmuyor."}
        </p>
      ) : (
        <ul className="list-none p-0 space-y-4">
          {filteredAndSortedWorkCenters.map((wc) => (
            <li key={wc._id} className="bg-white rounded-xl shadow-lg p-4 md:p-5 dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex-grow mb-2 sm:mb-0">
                <strong className="text-lg md:text-xl text-gray-900 dark:text-gray-100">{wc.name}</strong>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-200">
                  Kod: <span className="font-semibold">{wc.code}</span>
                </p>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-200">
                  Kapasite: <span className="font-semibold">{wc.capacity} {wc.capacityUnit}</span>
                </p>
                {wc.machineCount > 0 && (
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-200">
                    Makine Sayısı: <span className="font-semibold">{wc.machineCount}</span>
                  </p>
                )}
                {wc.personnelCount > 0 && (
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-200">
                    Personel Sayısı: <span className="font-semibold">{wc.personnelCount}</span>
                  </p>
                )}
                {wc.description && (
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-200">
                    Açıklama: <span className="font-semibold">{wc.description}</span>
                  </p>
                )}
                <p className={`text-sm md:text-base font-semibold ${wc.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  Durum: {wc.isActive ? 'Aktif' : 'Pasif'}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/admin/workcenters/edit/${wc._id}`}
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
                  onClick={() => handleDelete(wc._id)}
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

export default WorkCenterList;
