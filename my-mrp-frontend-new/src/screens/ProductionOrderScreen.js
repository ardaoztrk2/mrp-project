// frontend/src/screens/ProductionOrderScreen.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  listProductionOrders,
  createProductionOrder,
  updateProductionOrder,
  deleteProductionOrder,
} from '../actions/productionOrderActions'; // Üretim siparişi aksiyonları
import { PRODUCTION_ORDER_CREATE_RESET } from '../constants/productionOrderConstants'; // Reset sabiti

const ProductionOrderScreen = () => {
  const dispatch = useDispatch();

  // State'ler
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [productId, setProductId] = useState('');
  const [workCenterId, setWorkCenterId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // Redux state'lerinden verileri çekme
  const productionOrderList = useSelector((state) => state.productionOrderList);
  const { loading, error, productionOrders } = productionOrderList;

  const productionOrderCreate = useSelector((state) => state.productionOrderCreate);
  const { success: successCreate, error: errorCreate } = productionOrderCreate;

  const productionOrderUpdate = useSelector((state) => state.productionOrderUpdate);
  const { success: successUpdate, error: errorUpdate } = productionOrderUpdate;

  const productionOrderDelete = useSelector((state) => state.productionOrderDelete);
  const { success: successDelete, error: errorDelete } = productionOrderDelete;

  useEffect(() => {
    // Yeni üretim siparişi oluşturulduğunda veya güncellendiğinde/silindiğinde listeyi yenile
    if (successCreate) {
      dispatch({ type: PRODUCTION_ORDER_CREATE_RESET }); // Oluşturma state'ini sıfırla
      setName('');
      setQuantity(0);
      setProductId('');
      setWorkCenterId('');
      setIsEditing(false);
      setCurrentOrderId(null);
    }
    dispatch(listProductionOrders());
  }, [dispatch, successCreate, successUpdate, successDelete]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(
        updateProductionOrder(currentOrderId, {
          name,
          quantity,
          product: productId, // Backend'de product ve workCenter ID olarak tutuluyor
          workCenter: workCenterId,
        })
      );
    } else {
      dispatch(
        createProductionOrder({
          name,
          quantity,
          product: productId,
          workCenter: workCenterId,
        })
      );
    }
  };

  const editHandler = (order) => {
    setName(order.name);
    setQuantity(order.quantity);
    setProductId(order.product._id); // Ürün ID'sini al
    setWorkCenterId(order.workCenter._id); // İş merkezi ID'sini al
    setIsEditing(true);
    setCurrentOrderId(order._id);
  };

  const deleteHandler = (id) => {
    if (window.confirm('Bu üretim siparişini silmek istediğinizden emin misiniz?')) {
      dispatch(deleteProductionOrder(id));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Üretim Siparişleri</h1>

      {/* Üretim Siparişi Formu */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? 'Üretim Siparişini Düzenle' : 'Yeni Üretim Siparişi Oluştur'}
        </h2>
        {(errorCreate || errorUpdate) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {errorCreate || errorUpdate}
          </div>
        )}
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Sipariş Adı
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Sipariş Adı Girin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
              Miktar
            </label>
            <input
              type="number"
              id="quantity"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Miktar Girin"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="productId" className="block text-gray-700 text-sm font-bold mb-2">
              Ürün ID
            </label>
            <input
              type="text"
              id="productId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ürün ID Girin (Örn: 60d5ec49f8a7e40015f8c8b1)"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="workCenterId" className="block text-gray-700 text-sm font-bold mb-2">
              İş Merkezi ID
            </label>
            <input
              type="text"
              id="workCenterId"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="İş Merkezi ID Girin (Örn: 60d5ec49f8a7e40015f8c8b2)"
              value={workCenterId}
              onChange={(e) => setWorkCenterId(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isEditing ? 'Güncelle' : 'Oluştur'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentOrderId(null);
                  setName('');
                  setQuantity(0);
                  setProductId('');
                  setWorkCenterId('');
                }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Üretim Siparişleri Listesi */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Mevcut Üretim Siparişleri</h2>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sipariş Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Miktar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İş Merkezi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksiyonlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productionOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product ? order.product.name : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.workCenter ? order.workCenter.name : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => editHandler(order)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => deleteHandler(order._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionOrderScreen;
