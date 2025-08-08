// src/components/AdminRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Outlet'i BURAYA import edin
import { jwtDecode } from 'jwt-decode';

// children prop'unu artık doğrudan kullanmayacağız, Outlet kullanacağız
const AdminRoute = () => { // props'tan children'ı kaldırın
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return <Navigate to="/" replace />;
        }

        if (decoded.role !== 'admin') {
            return <Navigate to="/dashboard" replace />;
        }

    } catch (error) {
        console.error("Geçersiz veya bozuk token:", error);
        localStorage.removeItem('token');
        return <Navigate to="/" replace />;
    }

    // Yetkilendirme başarılıysa, sarmalanmış rotanın içeriğini render etmek için Outlet kullanın
    return <Outlet />;
};

export default AdminRoute;