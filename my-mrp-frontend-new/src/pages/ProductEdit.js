// src/pages/ProductEdit.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

function ProductEdit() {
  const { id } = useParams(); // URL'den ürün ID'sini al
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    stock: 0,
    unit: "",
    unitPrice: 0,
    rawMaterials: [],
    routing: [],
  });
  const [rawMaterialOptions, setRawMaterialOptions] = useState([]);
  const [workCenterOptions, setWorkCenterOptions] = useState([]);
  const [loading, setLoading] = useState(false); // Form gönderme durumu
  const [deleting, setDeleting] = useState(false); // Silme işlemi durumu
  const [fetchLoading, setFetchLoading] = useState(true); // Veri çekme durumu
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Silme onay modalı durumu

  useEffect(() => {
    const fetchProductAndOptions = async () => {
      try {
        const token = localStorage.getItem("token");

        const rawMatRes = await axios.get("http://localhost:5000/api/rawmaterials", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRawMaterialOptions(rawMatRes.data);

        const wcRes = await axios.get("http://localhost:5000/api/workcenters", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkCenterOptions(wcRes.data);

        const productRes = await axios.get(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productData = productRes.data;

        setFormData({
          name: productData.name,
          code: productData.code,
          description: productData.description || "",
          stock: productData.stock,
          unit: productData.unit,
          unitPrice: productData.unitPrice,
          rawMaterials: (productData.rawMaterials || []).map(item => ({
            rawMaterial: item.rawMaterial._id,
            quantity: item.quantity,
          })),
          routing: (productData.routing || []).map(step => ({
            workCenter: step.workCenter._id,
            setupTime: step.setupTime,
            runTime: step.runTime,
            notes: step.notes || "",
          })),
        });
      } catch (err) {
        console.error("Ürün veya seçenekler alınırken hata:", err);
        toast.error("Veriler yüklenirken bir hata oluştu.");
        setError(err.response?.data?.message || "Veriler yüklenirken bir hata oluştu.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProductAndOptions();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: ["stock", "unitPrice", "setupTime", "runTime"].includes(name) ? Number(value) : value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ürün başarıyla güncellendi!");
      navigate("/products");
    } catch (err) {
      console.error("Ürün güncellenirken hata:", err);
      toast.error(err.response?.data?.message || "Ürün güncellenirken bir hata oluştu.");
      setError(err.response?.data?.message || "Ürün güncellenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Silme işlemi için yeni fonksiyon
  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Ürün başarıyla silindi!");
      navigate("/products");
    } catch (err) {
      console.error("Ürün silinirken hata:", err);
      toast.error(err.response?.data?.message || "Ürün silinirken bir hata oluştu.");
      setError(err.response?.data?.message || "Ürün silinirken bir hata oluştu.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false); // Modalı kapat
    }
  };

  if (fetchLoading) {
    return <p className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 text-gray-800 dark:text-gray-200">Veriler yükleniyor...</p>;
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        ✏️ Ürün Düzenle
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300 max-w-2xl mx-auto">
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

        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Hammadde Reçetesi</h3>
        {(formData.rawMaterials || []).map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg dark:border-gray-700 relative">
            <button type="button" onClick={() => removeRawMaterial(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Hammadde:</label>
              <select value={item.rawMaterial} onChange={(e) => handleRawMaterialChange(index, "rawMaterial", e.target.value)} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" required>
                <option value="">Hammadde Seçin</option>
                {rawMaterialOptions.map((rm) => (<option key={rm._id} value={rm._id}>{rm.name} ({rm.unit})</option>))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Miktar:</label>
              <input type="number" value={item.quantity} onChange={(e) => handleRawMaterialChange(index, "quantity", Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" required min="0" />
            </div>
          </div>
        ))}
        <button type="button" onClick={addRawMaterial} className="mb-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700">
          + Hammadde Ekle
        </button>

        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Üretim Rotası (Routing)</h3>
        {(formData.routing || []).map((step, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg dark:border-gray-700 relative">
            <button type="button" onClick={() => removeRoutingStep(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg">&times;</button>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">İş Merkezi:</label>
              <select value={step.workCenter} onChange={(e) => handleRoutingStepChange(index, "workCenter", e.target.value)} className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" required>
                <option value="">İş Merkezi Seçin</option>
                {workCenterOptions.map((wc) => (<option key={wc._id} value={wc._id}>{wc.name} ({wc.code})</option>))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Kurulum Süresi (dk):</label>
              <input type="number" value={step.setupTime} onChange={(e) => handleRoutingStepChange(index, "setupTime", Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" required min="0" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Çalışma Süresi (dk/ürün):</label>
              <input type="number" value={step.runTime} onChange={(e) => handleRoutingStepChange(index, "runTime", Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" required min="0" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Notlar (İsteğe Bağlı):</label>
              <textarea value={step.notes} onChange={(e) => handleRoutingStepChange(index, "notes", e.target.value)} rows="2" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"></textarea>
            </div>
          </div>
        ))}
        <button type="button" onClick={addRoutingStep} className="mb-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700">
          + Rotasyon Adımı Ekle
        </button>

        {/* Butonlar */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)} // Modalı açar
            disabled={deleting || loading}
            className={`
              bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline transition-colors duration-200
              ${deleting || loading ? "opacity-50 cursor-not-allowed" : ""}
              dark:bg-red-600 dark:hover:bg-red-800
            `}
          >
            {deleting ? "Siliniyor..." : "Ürünü Sil"}
          </button>
          <button
            type="submit"
            disabled={loading || deleting}
            className={`
              bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded
              focus:outline-none focus:shadow-outline transition-colors duration-200
              ${loading || deleting ? "opacity-50 cursor-not-allowed" : ""}
              dark:bg-green-600 dark:hover:bg-green-800
            `}
          >
            {loading ? "Güncelleniyor..." : "Ürünü Güncelle"}
          </button>
        </div>
      </form>

      {/* Silme Onayı Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl dark:bg-gray-800 dark:text-gray-100 max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Onay Gerekli</h3>
            <p className="mb-6">Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition-colors duration-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                disabled={deleting}
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700 transition-colors duration-200"
                disabled={deleting}
              >
                {deleting ? "Siliniyor..." : "Evet, Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductEdit;
