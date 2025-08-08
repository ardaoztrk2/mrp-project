// src/pages/Register.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) {
      errors.name = "Ad Soyad alanı zorunludur.";
    } else if (form.name.trim().length < 3) {
      errors.name = "Ad Soyad en az 3 karakter olmalıdır.";
    }

    if (!form.email.trim()) {
      errors.email = "E-posta alanı zorunludur.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Geçerli bir e-posta adresi girin.";
    }

    if (!form.password.trim()) {
      errors.password = "Şifre alanı zorunludur.";
    } else if (form.password.length < 6) {
      errors.password = "Şifre en az 6 karakter olmalıdır.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      toast.error("Lütfen formdaki hataları düzeltin.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/users/register", form);
      toast.success("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      setForm({ name: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error("Kayıt hatası:", err);
      toast.error(err.response?.data?.message || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-0"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1510519153676-e1374d6dc22b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-400 rounded-full opacity-30 blur-3xl animate-ping"></div>

      <div className="absolute top-8 md:top-16 w-full flex justify-center z-20">
        <img
          src="https://placehold.co/120x120/E0F7FA/004D40?text=MRP+Logo"
          alt="MRP Logo"
          className="w-28 h-28 md:w-32 md:h-32 rounded-full shadow-lg border-4 border-white object-cover"
        />
      </div>

      <div
        className="z-30 bg-white bg-opacity-95 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md w-full max-w-sm md:max-w-md mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
          📝 Kayıt Ol
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Adınız Soyadınız"
              value={form.name}
              onChange={handleChange}
              // <<<<<<<<<< BURADAKİ HATA DÜZELTİLDİ! className string'i doğru kapatıldı.
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-4 transition duration-300 shadow-sm text-lg ${
                validationErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={loading}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.name}</p>
            )}
          </div>
          
          <div>
            <input
              name="email"
              type="email"
              placeholder="E-posta Adresi"
              value={form.email}
              onChange={handleChange}
              // <<<<<<<<<< BURADAKİ HATA DÜZELTİLDİ!
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-4 transition duration-300 shadow-sm text-lg ${
                validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={loading}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Şifre"
              value={form.password}
              onChange={handleChange}
              // <<<<<<<<<< BURADAKİ HATA DÜZELTİLDİ!
              className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-4 transition duration-300 shadow-sm text-lg ${
                validationErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              disabled={loading}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.password}</p>
            )}
          </div>

          <div>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 shadow-sm text-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              disabled={loading}
            >
              <option value="user">Kullanıcı</option>
              <option value="admin">Yönetici</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center gap-2 text-lg ${
              loading ? "opacity-70 cursor-not-allowed" : "shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Kaydediliyor...
              </>
            ) : (
              "Kayıt Ol"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-md">
          Zaten hesabın var mı?{" "}
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
