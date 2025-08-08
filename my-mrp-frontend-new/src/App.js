// src/App.js

import React, { useState, useEffect } from "react";
// Sadece BrowserRouter'ı Router olarak import ediyoruz, Routes, Route, useLocation, useNavigate AppContent içinde kullanılacak
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ProductList from "./pages/ProductList";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";
import AddRawMaterial from "./pages/AddRawMaterial"; // Bu büyük ihtimalle RawMaterialList olmalıydı veya AddRawMaterial adını koruyacaksanız
import OrderList from "./pages/OrderList";
import UserList from "./pages/UserList";
import RawMaterialAdd from "./pages/RawMaterialAdd";
import Stats from "./pages/Stats";
import Navbar from "./components/Navbar"; // Navbar component'iniz
import { jwtDecode } from "jwt-decode";
import ProductAdd from "./pages/ProductAdd";
import ProductEdit from "./pages/ProductEdit";
import OrderAdd from "./pages/OrderAdd";
import OrderEdit from "./pages/OrderEdit";
import MrpReport from "./pages/MrpReport";
import RawMaterialEdit from "./pages/RawMaterialEdit";
import WorkCenterList from './pages/WorkCenterList';
import WorkCenterAdd from './pages/WorkCenterAdd';
import WorkCenterEdit from './pages/WorkCenterEdit';
import ProductionOrderScreen from './screens/ProductionOrderScreen';
import StockMovementList from './components/StockMovementList';
import StockMovementAdd from './pages/StockMovementAdd';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from "./contexts/ThemeContext";

// AppContent component'i tüm rotaları ve navigasyonu yönetecek ana içerik component'imizdir.
function AppContent() {
    const [userName, setUserName] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserName(decoded.name || decoded.email || "Kullanıcı");
                setUserRole(decoded.role);
            } catch (error) { // <-- Düzeltilen yer
                console.error("Token çözümlenirken hata veya geçersiz token:", error);
                localStorage.removeItem("token");
                setUserName(null);
                setUserRole(null);
                // navigate("/"); // Opsiyonel: Geçersiz token durumunda giriş sayfasına yönlendir
            }
        } else {
            setUserName(null);
            setUserRole(null);
        }
    }, [location.pathname]); // location.pathname değiştiğinde kullanıcı bilgilerini güncelleyin

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUserName(null);
        setUserRole(null);
        navigate("/");
    };

    // Navbar'ı göstermeyeceğimiz yollar
    const hideNavbar = ["/", "/register"].includes(location.pathname);

    return (
        <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
            {!hideNavbar && userName && (
                <Navbar userName={userName} userRole={userRole} onLogout={handleLogout} />
            )}

            {/* Sayfa içeriği burada render edilecek */}
            <div className="flex-grow"> {/* İçeriğin büyümesini ve padding almasını sağlayın */}
                <Routes>
                    {/* Public Rotalar */}
                    <Route path="/" element={<Login setUserName={setUserName} />} />
                    <Route path="/register" element={<Register />} />

                    {/* Private Rotalar (Giriş Yapmış Kullanıcılar İçin) */}
                    {/* PrivateRoute component'i children prop'u ile rotaları sarmalıyor */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/stats" element={<Stats />} />
                        <Route path="/admin/rawmaterials/add" element={<RawMaterialAdd />} /> {/* AddRawMaterial veya RawMaterialList */}
                        <Route path="/productionorders" element={<ProductionOrderScreen />} />
                        {/* Yeni Stok Hareketleri Rotası - Private Route içinde */}
                        <Route path="/stock-movements" element={<StockMovementList />} />
                    </Route>

                    <Route element={<PrivateRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/products" element={<ProductList />} />
    <Route path="/stats" element={<Stats />} />
    <Route path="/admin/rawmaterials/add" element={<RawMaterialAdd />} />
    <Route path="/productionorders" element={<ProductionOrderScreen />} />
    <Route path="/stock-movements" element={<StockMovementList />} />
    {/* YENİ ROTA BURADA */}
    <Route path="/stock-movements/add" element={<StockMovementAdd />} />
</Route>


                    {/* Admin Rotalar (Sadece Admin Yetkisi Olan Kullanıcılar İçin) */}
                    {/* AdminRoute component'i children prop'u ile rotaları sarmalıyor */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/admin/order-add" element={<OrderAdd />} />
                        <Route path="/admin/order-edit/:id" element={<OrderEdit />} />
                        <Route path="/admin/product-add" element={<ProductAdd />} />
                        <Route path="/admin/product-edit/:id" element={<ProductEdit />} />
                        <Route path="/admin/orders" element={<OrderList />} />
                        <Route path="/admin/users" element={<UserList />} />
                        <Route path="/admin/rawmaterials" element={<AddRawMaterial />} /> {/* RawMaterialList */}
                        <Route path="/admin/rawmaterials/edit/:id" element={<RawMaterialEdit />} />
                        <Route path="/admin/mrp-report" element={<MrpReport />} />

                        {/* İş Merkezi Yönetimi Rotaları */}
                        <Route path="/admin/workcenters" element={<WorkCenterList />} />
                        <Route path="/admin/workcenters/add" element={<WorkCenterAdd />} />
                        <Route path="/admin/workcenters/edit/:id" element={<WorkCenterEdit />} />
                    </Route>


                    {/* 404 Sayfası için Catch-all Route (isteğe bağlı) */}
                    <Route path="*" element={<h1>404 - Sayfa Bulunamadı</h1>} />

                </Routes>
            </div>
            <ToastContainer />
        </div>
    );
}

// Ana App component'i sadece Router'ı sarmalayacak ve AppContent'i render edecek
function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;