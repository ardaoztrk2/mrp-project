// src/pages/StockMovementAdd.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StockMovementAdd = () => {
    const [materials, setMaterials] = useState([]); // Ürünler ve Hammaddeler
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [movementType, setMovementType] = useState('in'); // <-- BURASI DEĞİŞTİRİLDİ: Varsayılan 'in' (backend'in beklediği gibi)
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');
    const [movementDate, setMovementDate] = useState(new Date().toISOString().split('T')[0]); // Varsayılan bugün
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const token = localStorage.getItem('token'); 
                if (!token) { 
                    toast.error("Giriş yapmanız gerekiyor. Lütfen giriş yapın.");
                    navigate('/login');
                    return; 
                }

                const productsResponse = await axios.get('http://localhost:5000/api/products', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const products = productsResponse.data.map(p => ({
                    id: p._id,
                    name: p.name,
                    type: 'Product',
                    unit: p.unit
                }));

                const rawMaterialsResponse = await axios.get('http://localhost:5000/api/rawmaterials', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const rawMaterials = rawMaterialsResponse.data.map(rm => ({
                    id: rm._id,
                    name: rm.name,
                    type: 'RawMaterial',
                    unit: rm.unit
                }));

                setMaterials([...products, ...rawMaterials]);
            } catch (error) {
                console.error('Malzemeler çekilirken hata oluştu:', error.response?.data?.message || error.message);
                toast.error('Malzemeler yüklenirken bir sorun oluştu!');
                 if (error.response && error.response.status === 401) {
                    navigate('/login'); 
                }
            }
        };
        fetchMaterials();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMaterial || !quantity || quantity <= 0) {
            toast.error('Lütfen tüm alanları doldurun ve geçerli bir miktar girin.');
            return;
        }

        const materialInfo = materials.find(m => m.id === selectedMaterial);
        if (!materialInfo) {
            toast.error('Geçersiz malzeme seçimi.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Giriş yapmanız gerekiyor. Lütfen giriş yapın.");
                navigate('/login');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/stock-movements', {
                material: materialInfo.id,       
                materialName: materialInfo.name, 
                materialType: materialInfo.type, 
                unit: materialInfo.unit, 
                type: movementType,              // Bu zaten 'in' veya 'out' olarak gönderilecek
                quantity: parseFloat(quantity),  
                date: movementDate,
                notes
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast.success('Stok hareketi başarıyla eklendi!');
            console.log('Eklenen Stok Hareketi:', response.data);

            navigate('/stock-movements');

        } catch (error) {
            console.error('Stok hareketi eklenirken hata oluştu:', error.response?.data?.message || error.message);
            toast.error(`Stok hareketi eklenirken hata: ${error.response?.data?.message || 'Bilinmeyen hata'}`);
             if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    return (
        <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Yeni Stok Hareketi Ekle</h2>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="material" className="block text-sm font-medium mb-2 text-gray-300">Malzeme:</label>
                    <select
                        id="material"
                        value={selectedMaterial}
                        onChange={(e) => setSelectedMaterial(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Malzeme Seçin</option>
                        {materials.map((material) => (
                            <option key={material.id} value={material.id}>
                                {material.name} ({material.type === 'Product' ? 'Ürün' : 'Hammadde'}) - {material.unit}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="movementType" className="block text-sm font-medium mb-2 text-gray-300">Hareket Tipi:</label>
                    <select
                        id="movementType"
                        value={movementType}
                        onChange={(e) => setMovementType(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="in">Giriş</option> {/* <-- BURASI DÜZELTİLDİ */}
                        <option value="out">Çıkış</option> {/* <-- BURASI DÜZELTİLDİ */}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-medium mb-2 text-gray-300">Miktar:</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                        required
                        min="0.01"
                        step="0.01"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="movementDate" className="block text-sm font-medium mb-2 text-gray-300">Tarih:</label>
                    <input
                        type="date"
                        id="movementDate"
                        value={movementDate}
                        onChange={(e) => setMovementDate(e.target.value)}
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="notes" className="block text-sm font-medium mb-2 text-gray-300">Notlar (Opsiyonel):</label>
                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="3"
                        className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                    Stok Hareketi Ekle
                </button>
            </form>
        </div>
    );
};

export default StockMovementAdd;