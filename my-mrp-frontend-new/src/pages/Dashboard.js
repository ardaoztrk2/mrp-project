import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    // Ana kapsayıcı: Mobil için p-4, md için p-6. Arka plan ve metin renkleri responsive
    <div className="p-4 md:p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        📊 Gösterge Paneli
      </h2>

      {/* İstatistikleri Gör Butonu */}
      <div className="mb-6 md:mb-8">
        <Link
          to="/stats"
          className="
            inline-flex items-center gap-2
            px-4 py-2 md:px-6 md:py-3
            bg-blue-600 hover:bg-blue-700
            text-white font-semibold rounded-lg
            shadow-md hover:shadow-lg
            transition-all duration-300
            dark:bg-blue-700 dark:hover:bg-blue-800
            text-sm md:text-base
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 10.586V6z" clipRule="evenodd" />
          </svg>
          İstatistikleri Gör
        </Link>
      </div>

      {/* Bilgilendirme Kartı */}
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-6 md:mb-8 shadow-md
                    dark:bg-green-800 dark:border-green-600 dark:text-green-200 transition-colors duration-300
                    text-sm md:text-base">
        <strong className="font-bold">Bilgi:</strong>
        <span className="block sm:inline ml-2">Tüm stoklar güvenli seviyede.</span>
      </div>

      {/* Yönetim Kartları: Mobil için 1 sütun, md için 2 sütun */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Ürün Yönetimi Kartı */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col justify-between
                      dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
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
              Tüm ürünlerinizi görüntüleyin ve yönetin.
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
            → Ürünleri Gör
          </Link>
        </div>

        {/* Sipariş Yönetimi Kartı */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6 flex flex-col justify-between
                      dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
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
              Siparişleri izleyin ve durumlarını yönetin.
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
            → Siparişlere Git
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;