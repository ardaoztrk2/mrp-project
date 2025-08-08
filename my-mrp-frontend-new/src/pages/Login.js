import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUserName }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // API çağrısı: Tam URL'yi belirtin
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        const base64Url = data.token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const user = JSON.parse(jsonPayload);
        setUserName(user.name || user.email || "Kullanıcı");

        console.log("Giriş başarılı!");
        navigate("/dashboard");
      } else {
        setError(data.message || "Giriş başarısız! Lütfen bilgilerinizi kontrol edin.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Sunucu hatası:", err);
      setError("Sunucuya bağlanırken bir sorun oluştu.");
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

      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400 rounded-full opacity-30 blur-3xl animate-ping"></div>

      <div className="absolute top-8 md:top-16 w-full flex justify-center z-20">
        <img
          src="https://placehold.co/120x120/E0F7FA/004D40?text=MRP+Logo"
          alt="MRP Logo"
          className="w-28 h-28 md:w-32 md:h-32 rounded-full shadow-lg border-4 border-white transform hover:scale-105 transition-transform duration-300 object-cover"
        />
      </div>

      <div
        className={`z-30 bg-white bg-opacity-95 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md w-full max-w-sm md:max-w-md mx-auto transition-all duration-700 ease-out transform ${
          animate ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
          🔒 Giriş Yap
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="email"
            type="email"
            placeholder="E-posta Adresi"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 shadow-sm text-lg"
            disabled={loading}
          />
          <input
            name="password"
            type="password"
            placeholder="Şifre"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 shadow-sm text-lg"
            disabled={loading}
          />

          {error && (
            <p className="text-red-600 text-sm text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center gap-2 text-lg ${
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
                Yükleniyor...
              </>
            ) : (
              "Giriş Yap"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-md">
          Hesabın yok mu?{" "}
          <a href="/register" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300">
            Kayıt Ol
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;