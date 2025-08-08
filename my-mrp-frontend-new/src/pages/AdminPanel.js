// src/pages/AdminPanel.js
import React from "react";
import { Link } from "react-router-dom";

function AdminPanel() {
  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        ⚙️ Yönetici Paneli
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Kullanıcı Yönetimi Kartı */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col justify-between dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              Kullanıcı Yönetimi
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
              Kullanıcıları görüntüleyin, ekleyin, düzenleyin veya silin.
            </p>
          </div>
          <Link
            to="/admin/users"
            className="
              inline-flex items-center gap-1
              text-blue-600 hover:text-blue-800
              font-semibold transition-colors duration-200
              dark:text-blue-400 dark:hover:text-blue-300
              text-sm md:text-base
            "
          >
            → Kullanıcıları Yönet
          </Link>
        </div>

        {/* Hammadde Yönetimi Kartı */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col justify-between dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.5 3A2.5 2.5 0 003 5.5v9A2.5 2.5 0 005.5 17h9a2.5 2.5 0 002.5-2.5v-9A2.5 2.5 0 0014.5 3h-9zM5.5 4h9A1.5 1.5 0 0116 5.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 14.5v-9A1.5 1.5 0 015.5 4zM10 8a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </span>
              Hammadde Yönetimi
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
              Hammaddeleri görüntüleyin, ekleyin, düzenleyin veya silin.
            </p>
          </div>
          <Link
            to="/admin/rawmaterials"
            className="
              inline-flex items-center gap-1
              text-blue-600 hover:text-blue-800
              font-semibold transition-colors duration-200
              dark:text-blue-400 dark:hover:text-blue-300
              text-sm md:text-base
            "
          >
            → Hammaddeleri Yönet
          </Link>
        </div>

        {/* Ürün Yönetimi Kartı */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col justify-between dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v11a1 1 0 01-1 1H5a1 1 0 01-1-1V7z" />
                </svg>
              </span>
              Ürün Yönetimi
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
              Tüm ürünlerinizi görüntüleyin, ekleyin, düzenleyin veya silin.
            </p>
          </div>
          <Link
            to="/products"
            className="
              inline-flex items-center gap-1
              text-blue-600 hover:text-blue-800
              font-semibold transition-colors duration-200
              dark:text-blue-400 dark:hover:text-blue-300
              text-sm md:text-base
            "
          >
            → Ürünleri Yönet
          </Link>
        </div>

        {/* Sipariş Yönetimi Kartı */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col justify-between dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.147-1.146A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a1 1 0 100-2 1 1 0 000 2zm-4-1a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </span>
              Sipariş Yönetimi
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
              Siparişleri görüntüleyin, ekleyin, düzenleyin veya silin.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="
              inline-flex items-center gap-1
              text-blue-600 hover:text-blue-800
              font-semibold transition-colors duration-200
              dark:text-blue-400 dark:hover:text-blue-300
              text-sm md:text-base
            "
          >
            → Siparişleri Yönet
          </Link>
        </div>

        {/* MRP Raporu Kartı */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col justify-between dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3zm11.707 3.293a1 1 0 00-1.414 0L10 9.586 7.707 7.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              MRP Raporu
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
              Malzeme ihtiyaç planlaması raporunu görüntüleyin.
            </p>
          </div>
          <Link
            to="/admin/mrp-report"
            className="
              inline-flex items-center gap-1
              text-blue-600 hover:text-blue-800
              font-semibold transition-colors duration-200
              dark:text-blue-400 dark:hover:text-blue-300
              text-sm md:text-base
            "
          >
            → Raporu Gör
          </Link>
        </div>

        {/* YENİ EKLENEN: İş Merkezi Yönetimi Kartı */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col justify-between dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="text-indigo-500"> {/* Yeni bir renk seçtim */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.5 1.5 0 01-1.06 1.06c-1.56.38-1.56 2.6 0 2.98a1.5 1.5 0 011.06 1.06c.38 1.56 2.6 1.56 2.98 0a1.5 1.5 0 011.06-1.06c1.56-.38 1.56-2.6 0-2.98a1.5 1.5 0 01-1.06-1.06zM10 10a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-4 7a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </span>
              İş Merkezi Yönetimi
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 md:mb-4">
              Üretim iş merkezlerini ve kapasitelerini tanımlayın ve yönetin.
            </p>
          </div>
          <Link
            to="/admin/workcenters"
            className="
              inline-flex items-center gap-1
              text-blue-600 hover:text-blue-800
              font-semibold transition-colors duration-200
              dark:text-blue-400 dark:hover:text-blue-300
              text-sm md:text-base
            "
          >
            → İş Merkezlerini Yönet
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
