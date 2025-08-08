// src/pages/ProductAdd.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

function ProductAdd() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    stock: 0,
    unit: "",
    unitPrice: 0,
    rawMaterials: [], // { rawMaterial: id, quantity: number }
    routing: [], // <<<<<<<<<< YENİ: Routing alanı eklendi
  });
  const [rawMaterialOptions, setRawMaterialOptions] = useState([]); // Hammadde seçenekleri için
  const [workCenterOptions, setWorkCenterOptions] = useState([]); // <<<<<<<<<< YENİ: İş merkezi seçenekleri için
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true); // Hammadde/İş Merkezi seçenekleri yüklenirken
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        // Hammaddeleri getir
        const rawMatRes = await axios.get("http://localhost:5000/api/rawmaterials", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRawMaterialOptions(rawMatRes.data);

        // <<<<<<<<<< YENİ: İş merkezlerini getir
        const wcRes = await axios.get("http://localhost:5000/api/workcenters", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkCenterOptions(wcRes.data);
        // <<<<<<<<<< YENİ KOD SONU

      } catch (err) {
        console.error("Seçenekler alınırken hata:", err);
        toast.error("Gerekli veriler yüklenirken bir hata oluştu.");
        setError(err.response?.data?.message || "Gerekli veriler yüklenirken bir hata oluştu.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: ["stock", "unitPrice"].includes(name) ? Number(value) : value,
    }));
  };

  // Hammadde yönetimi
  const handleRawMaterialChange = (index, field, value) => {
    const updatedRawMaterials = [...formData.rawMaterials];
    updatedRawMaterials[index][field] = value;
    setFormData((prevData) => ({ ...prevData, rawMaterials: updatedRawMaterials }));
  };

  const addRawMaterial = () => {
    setFormData((prevData) => ({
      ...prevData,
      rawMaterials: [...prevData.rawMaterials, { rawMaterial: "", quantity: 0 }],
    }));
  };

  const removeRawMaterial = (index) => {
    const updatedRawMaterials = formData.rawMaterials.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, rawMaterials: updatedRawMaterials }));
  };

  // <<<<<<<<<< YENİ: Rotasyon yönetimi
  const handleRoutingStepChange = (index, field, value) => {
    const updatedRouting = [...formData.routing];
    updatedRouting[index][field] = value;
    setFormData((prevData) => ({ ...prevData, routing: updatedRouting }));
  };

  const addRoutingStep = () => {
    setFormData((prevData) => ({
      ...prevData,
      routing: [...prevData.routing, { workCenter: "", setupTime: 0, runTime: 0, notes: "" }],
    }));
  };

  const removeRoutingStep = (index) => {
    const updatedRouting = formData.routing.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, routing: updatedRouting }));
  };
  // <<<<<<<<<< YENİ KOD SONU

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ürün başarıyla eklendi!");
      navigate("/products"); // Ürün listesi sayfasına yönlendir
    } catch (err) {
      console.error("Ürün eklenirken hata:", err);
      toast.error(err.response?.data?.message || "Ürün eklenirken bir hata oluştu.");
      setError(err.response?.data?.message || "Ürün eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <p className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 text-gray-800 dark:text-gray-200">Veriler yükleniyor...</p>;
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        ➕ Yeni Ürün Ekle
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300 max-w-2xl mx-auto">
        {/* Temel Ürün Bilgileri */}
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Temel Bilgiler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Ad:</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" required />
          </div>
          <div>
            <label htmlFor="code" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Kod:</label>
            <input type="text" id="code" name="code" value={formData.code} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" required />
          </div>
          <div>
            <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Stok:</label>
            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" required min="0" />
          </div>
          <div>
            <label htmlFor="unit" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Birim:</label>
            <input type="text" id="unit" name="unit" value={formData.unit} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" required />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="unitPrice" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Birim Fiyatı:</label>
            <input type="number" id="unitPrice" name="unitPrice" value={formData.unitPrice} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" required min="0" step="0.01" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Açıklama (İsteğe Bağlı):</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"></textarea>
          </div>
        </div>

        {/* Hammadde Reçetesi */}
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Hammadde Reçetesi</h3>
        {formData.rawMaterials.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg dark:border-gray-700 relative">
            <button
              type="button"
              onClick={() => removeRawMaterial(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
            >
              &times;
            </button>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Hammadde:</label>
              <select
                value={item.rawMaterial}
                onChange={(e) => handleRawMaterialChange(index, "rawMaterial", e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
              >
                <option value="">Hammadde Seçin</option>
                {rawMaterialOptions.map((rm) => (
                  <option key={rm._id} value={rm._id}>
                    {rm.name} ({rm.unit})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Miktar:</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleRawMaterialChange(index, "quantity", Number(e.target.value))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
                min="0"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addRawMaterial}
          className="mb-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          + Hammadde Ekle
        </button>

        {/* <<<<<<<<<< YENİ: Üretim Rotası (Routing) */}
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Üretim Rotası (Routing)</h3>
        {formData.routing.map((step, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg dark:border-gray-700 relative">
            <button
              type="button"
              onClick={() => removeRoutingStep(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
            >
              &times;
            </button>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">İş Merkezi:</label>
              <select
                value={step.workCenter}
                onChange={(e) => handleRoutingStepChange(index, "workCenter", e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
              >
                <option value="">İş Merkezi Seçin</option>
                {workCenterOptions.map((wc) => (
                  <option key={wc._id} value={wc._id}>
                    {wc.name} ({wc.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Kurulum Süresi (dk):</label>
              <input
                type="number"
                value={step.setupTime}
                onChange={(e) => handleRoutingStepChange(index, "setupTime", Number(e.target.value))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Çalışma Süresi (dk/ürün):</label>
              <input
                type="number"
                value={step.runTime}
                onChange={(e) => handleRoutingStepChange(index, "runTime", Number(e.target.value))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                required
                min="0"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Notlar (İsteğe Bağlı):</label>
              <textarea
                value={step.notes}
                onChange={(e) => handleRoutingStepChange(index, "notes", e.target.value)}
                rows="2"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              ></textarea>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addRoutingStep}
          className="mb-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          + Rotasyon Adımı Ekle
        </button>
        {/* <<<<<<<<<< YENİ KOD SONU */}

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
          {loading ? "Ekleniyor..." : "Ürün Ekle"}
        </button>
      </form>
    </div>
  );
}

export default ProductAdd;
