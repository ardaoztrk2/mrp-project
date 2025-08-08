// src/pages/UserList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Kullanıcılar alınamadı:", err);
      setError(err.response?.data?.message || "Kullanıcılar yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) { // Daha iyi bir modal kullanılabilir
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Kullanıcı başarıyla silindi!"); // Daha iyi bir bildirim sistemi kullanılabilir
        fetchUsers(); // Listeyi güncelle
      } catch (err) {
        console.error("Kullanıcı silinirken hata:", err);
        setError(err.response?.data?.message || "Kullanıcı silinirken bir hata oluştu.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="p-6 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 min-h-screen">Yükleniyor...</p>;
  if (error) return <p className="p-6 text-red-500 dark:text-red-400 bg-gray-100 dark:bg-gray-900 min-h-screen">{error}</p>;

  return (
    // Ana kapsayıcı: Koyu modda arka plan rengi ve metin rengi
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        👥 Kullanıcı Listesi
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Henüz hiç kullanıcı bulunmuyor.</p>
      ) : (
        <ul className="list-none p-0 space-y-4">
          {users.map((user) => (
            // Kullanıcı kartı: Koyu modda arka plan rengi, gölge ve metin rengi
            <li key={user._id} className="bg-white rounded-xl shadow-lg p-5 dark:bg-gray-800 dark:text-gray-100 dark:shadow-xl transition-colors duration-300">
              <div className="flex justify-between items-center mb-2">
                <strong className="text-xl text-gray-900 dark:text-gray-100">{user.name}</strong>
                <span className="text-gray-600 dark:text-gray-300">Rol: {user.role}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                E-posta: <span className="font-semibold">{user.email}</span>
              </p>
              <div className="mt-4 flex justify-end space-x-2">
                {/* Kullanıcı düzenleme rotanız yoksa bu linki kaldırın */}
                {/* <Link
                  to={`/admin/users/edit/${user._id}`}
                  className="
                    inline-flex items-center gap-1
                    px-4 py-2
                    text-sm font-semibold
                    text-white
                    bg-blue-600 hover:bg-blue-700
                    rounded-lg
                    transition-colors duration-200
                    shadow-sm
                    dark:bg-blue-700 dark:hover:bg-blue-800
                  "
                >
                  ✏️ Düzenle
                </Link> */}
                <button
                  onClick={() => handleDelete(user._id)}
                  className="
                    inline-flex items-center gap-1
                    px-4 py-2
                    text-sm font-semibold
                    text-white
                    bg-red-600 hover:bg-red-700
                    rounded-lg
                    transition-colors duration-200
                    shadow-sm
                    dark:bg-red-700 dark:hover:bg-red-800
                  "
                >
                  🗑️ Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;
