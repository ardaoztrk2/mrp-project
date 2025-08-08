// frontend/src/actions/productionOrderActions.js
import axios from 'axios';
import {
  PRODUCTION_ORDER_LIST_REQUEST,
  PRODUCTION_ORDER_LIST_SUCCESS,
  PRODUCTION_ORDER_LIST_FAIL,
  PRODUCTION_ORDER_DETAILS_REQUEST,
  PRODUCTION_ORDER_DETAILS_SUCCESS,
  PRODUCTION_ORDER_DETAILS_FAIL,
  PRODUCTION_ORDER_CREATE_REQUEST,
  PRODUCTION_ORDER_CREATE_SUCCESS,
  PRODUCTION_ORDER_CREATE_FAIL,
  PRODUCTION_ORDER_UPDATE_REQUEST,
  PRODUCTION_ORDER_UPDATE_SUCCESS,
  PRODUCTION_ORDER_UPDATE_FAIL,
  PRODUCTION_ORDER_DELETE_REQUEST,
  PRODUCTION_ORDER_DELETE_SUCCESS,
  PRODUCTION_ORDER_DELETE_FAIL,
} from '../constants/productionOrderConstants';

// Örnek: Üretim Siparişlerini Listeleme Aksiyonu (Şimdilik boş)
export const listProductionOrders = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCTION_ORDER_LIST_REQUEST });

    // API çağrısı burada yapılacak
    // const { data } = await axios.get('/api/productionorders');

    dispatch({
      type: PRODUCTION_ORDER_LIST_SUCCESS,
      payload: [], // Şimdilik boş bir dizi döndürüyoruz
    });
  } catch (error) {
    dispatch({
      type: PRODUCTION_ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Üretim Siparişi Oluşturma Aksiyonu (Şimdilik boş)
export const createProductionOrder = (productionOrder) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCTION_ORDER_CREATE_REQUEST });

    // API çağrısı burada yapılacak
    // const { data } = await axios.post('/api/productionorders', productionOrder);

    dispatch({
      type: PRODUCTION_ORDER_CREATE_SUCCESS,
      payload: {}, // Şimdilik boş bir obje döndürüyoruz
    });
  } catch (error) {
    dispatch({
      type: PRODUCTION_ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Üretim Siparişi Güncelleme Aksiyonu (Şimdilik boş)
export const updateProductionOrder = (productionOrder) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCTION_ORDER_UPDATE_REQUEST });

    // API çağrısı burada yapılacak
    // const { data } = await axios.put(`/api/productionorders/${productionOrder._id}`, productionOrder);

    dispatch({
      type: PRODUCTION_ORDER_UPDATE_SUCCESS,
      payload: {}, // Şimdilik boş bir obje döndürüyoruz
    });
  } catch (error) {
    dispatch({
      type: PRODUCTION_ORDER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Üretim Siparişi Silme Aksiyonu (Şimdilik boş)
export const deleteProductionOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCTION_ORDER_DELETE_REQUEST });

    // API çağrısı burada yapılacak
    // await axios.delete(`/api/productionorders/${id}`);

    dispatch({ type: PRODUCTION_ORDER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCTION_ORDER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Üretim Siparişi Detay Aksiyonu (Şimdilik boş)
export const getProductionOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCTION_ORDER_DETAILS_REQUEST });

    // API çağrısı burada yapılacak
    // const { data } = await axios.get(`/api/productionorders/${id}`);

    dispatch({
      type: PRODUCTION_ORDER_DETAILS_SUCCESS,
      payload: {}, // Şimdilik boş bir obje döndürüyoruz
    });
  } catch (error) {
    dispatch({
      type: PRODUCTION_ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
