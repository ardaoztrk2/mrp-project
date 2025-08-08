// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { jwtDecode } from 'jwt-decode';

const Navbar = ({ userName, userRole, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Token çözümlenirken hata:", error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md flex flex-col sm:flex-row justify-between items-center dark:bg-gray-800 dark:text-gray-100 transition-colors duration-300">
      <div className="flex flex-wrap items-center space-x-4 mb-2 sm:mb-0">
        <Link to="/dashboard" className="text-xl font-bold hover:text-blue-200 dark:hover:text-gray-300">
          MRP Panel
        </Link>
        <Link to="/products" className="hover:text-blue-200 dark:hover:text-gray-300">Ürünler</Link>
        <Link to="/admin/orders" className="hover:text-blue-200 dark:hover:text-gray-300">Siparişler</Link>
        <Link to="/admin/rawmaterials" className="hover:text-blue-200 dark:hover:text-gray-300">Hammadde</Link>
        <Link to="/stats" className="hover:text-blue-200 dark:hover:text-gray-300">İstatistik</Link>
        
        {/* BURAYA YENİ STOK HAREKETLERİ LİNKİNİ EKLEYİN */}
        <Link to="/stock-movements" className="hover:text-blue-200 dark:hover:text-gray-300">Stok Hareketleri</Link>

        {isAdmin && (
          <Link to="/admin" className="hover:text-blue-200 dark:hover:text-gray-300">
            Admin Paneli
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Koyu Mod Değiştirme Düğmesi */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-gray-500"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.325 5.924l-.707.707M6.364 6.364l-.707-.707m12.728 0l-.707-.707M6.364 17.636l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* userName veya userRole'u göster */}
        <span className="font-semibold text-blue-100 dark:text-gray-200">
          {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : userName}
        </span>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md transition-colors duration-300 dark:bg-red-700 dark:hover:bg-red-800"
        >
          Çıkış
        </button>
      </div>
    </nav>
  );
};

export default Navbar;