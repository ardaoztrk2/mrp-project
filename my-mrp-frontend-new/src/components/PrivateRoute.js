// src/components/PrivateRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Outlet'i BURAYA import edin
import { jwtDecode } from 'jwt-decode';

// children prop'unu artık doğrudan kullanmayacağız, Outlet kullanacağız
const PrivateRoute = () => { // props'tan children'ı kaldırın
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        // Token süresi dolmuş mu kontrolü (Unix zaman damgası)
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token'); // Süresi dolmuş token'ı kaldır
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        // Token geçersizse (örn: bozuk format), giriş sayfasına yönlendir
        console.error("Geçersiz token:", error);
        localStorage.removeItem('token');
        return <Navigate to="/" replace />;
    }

    // Token geçerliyse, sarmalanmış rotanın içeriğini render etmek için Outlet kullanın
    return <Outlet />;
};

export default PrivateRoute;