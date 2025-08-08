// src/pages/ProductList.js
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    console.log("Debug: Token from localStorage in ProductList:", token); // <<<<<<<<<< BU SATIRI EKLEYİN

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setProducts(data);
      } else {
        toast.error(data.message || "Ürünleri alırken hata oluştu.");
      }
    } catch (err) {
      console.error("❌ Sunucu hatası:", err);
      toast.error("Sunucuya bağlanırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
    });
  }, [products, searchTerm, sortKey, sortDirection]);

  if (loading) return <p className="p-4 md:p-6 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 min-h-screen">Yükleniyor...</p>;

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        📦 Ürün Listesi
      </h2>
      <Link
        to="/admin/product-add"
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
        ➕ Yeni Ürün Ekle
      </Link>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Ürün adı veya kodu ile ara..."
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
          <option value="stock-asc">Stok (Azalan)</option>
          <option value="stock-desc">Stok (Artan)</option>
          <option value="code-asc">Kod (A-Z)</option>
          <option value="code-desc">Kod (Z-A)</option>
        </select>
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
          {searchTerm ? "Aradığınız kriterlere uygun ürün bulunmuyor." : "Henüz hiç ürün bulunmuyor."}
        </p>
      ) : (
        <ul className="list-none p-0 space-y-4">
          {filteredAndSortedProducts.map((product) => (
            <li key={product._id} className="bg-white rounded-xl shadow-lg p-4 md:p-5 dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <strong className="text-lg md:text-xl text-gray-900 dark:text-gray-100 mb-1 sm:mb-0">{product.name}</strong>
                <span className="text-gray-600 dark:text-gray-300 text-sm md:text-base">Kod: {product.code}</span>
              </div>
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-200 mb-2">
                Stok: <span className="font-semibold">{product.stock} {product.unit}</span>
              </p>

              <h4 className="text-base md:text-lg font-semibold mt-3 md:mt-4 mb-1 md:mb-2 text-gray-800 dark:text-gray-100">İçerdiği Hammaddeler:</h4>
              <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1 text-sm md:text-base">
                {product.rawMaterials && product.rawMaterials.length > 0 ? (
                  product.rawMaterials.map((rm, index) => (
                    <li key={index}>
                      {rm.rawMaterial && rm.rawMaterial.name
                        ? `${rm.rawMaterial.name} - Miktar: ${rm.quantity} ${rm.rawMaterial.unit}`
                        : "‼️ Geçersiz hammadde (silinmiş olabilir)"}
                    </li>
                  ))
                ) : (
                  <li>Hammadde bilgisi yok</li>
                )}
              </ul>

              <div className="mt-3 md:mt-4 text-right">
                <Link
                  to={`/admin/product-edit/${product._id}`}
                  className="
                    inline-flex items-center gap-1
                    px-3 py-1 md:px-4 md:py-2
                    text-xs md:text-sm font-semibold
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductList;
