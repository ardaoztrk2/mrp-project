// src/pages/Stats.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { toast } from 'react-toastify';
import { useTheme } from '../contexts/ThemeContext';

const Stats = () => {
  const [stockData, setStockData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { theme } = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStockData(res.data.stockData);

        const formattedOrders = res.data.orderData.map((order) => ({
          date: order._id,
          count: order.count,
        }));

        setOrderData(formattedOrders);
      } catch (err) {
        console.error("❌ İstatistik alınamadı:", err);
        setError(err.response?.data?.message || "İstatistikler yüklenirken bir hata oluştu.");
        toast.error("İstatistikler yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <p className="p-4 md:p-6 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 min-h-screen">
        Yükleniyor...
      </p>
    );
  if (error)
    return (
      <p className="p-4 md:p-6 text-red-500 dark:text-red-400 bg-gray-100 dark:bg-gray-900 min-h-screen">
        {error}
      </p>
    );

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        📈 İstatistikler
      </h2>

      {/* Ürün Stok Durumu */}
      <div className="bg-white rounded-xl shadow p-4 md:p-5 mb-6 md:mb-10 dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800 dark:text-gray-100">
          📦 Ürün Stok Durumu
        </h3>
        <div className="w-full h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stockData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                tick={{
                  fill: theme === "dark" ? "#D1D5DB" : "#4B5563",
                  fontSize: 12,
                }}
              />
              <YAxis
                tick={{
                  fill: theme === "dark" ? "#D1D5DB" : "#4B5563",
                  fontSize: 12,
                }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#374151" : "#fff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow:
                    theme === "dark"
                      ? "0 4px 6px rgba(0,0,0,0.3)"
                      : "0 4px 6px rgba(0,0,0,0.1)",
                }}
                itemStyle={{
                  color: theme === "dark" ? "#D1D5DB" : "#4B5563",
                }}
              />
              <Bar dataKey="stock" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Günlük Sipariş Sayısı */}
      <div className="bg-white rounded-xl shadow p-4 md:p-5 dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800 dark:text-gray-100">
          📅 Günlük Sipariş Sayısı
        </h3>
        <div className="w-full h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={orderData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                tick={{
                  fill: theme === "dark" ? "#D1D5DB" : "#4B5563",
                  fontSize: 12,
                }}
              />
              <YAxis
                tick={{
                  fill: theme === "dark" ? "#D1D5DB" : "#4B5563",
                  fontSize: 12,
                }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#374151" : "#fff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow:
                    theme === "dark"
                      ? "0 4px 6px rgba(0,0,0,0.3)"
                      : "0 4px 6px rgba(0,0,0,0.1)",
                }}
                itemStyle={{
                  color: theme === "dark" ? "#D1D5DB" : "#4B5563",
                }}
              />
              <CartesianGrid
                stroke={theme === "dark" ? "#4B5563" : "#ccc"}
                strokeDasharray="3 3"
              />
              <Line type="monotone" dataKey="count" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;
