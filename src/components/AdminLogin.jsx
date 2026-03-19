import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import "./AdminLogin.css";

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        onLoginSuccess(data.session);
      }
    } catch (error) {
      setErrorMsg(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="auth-card p-5">
        <h3 className="auth-title mb-4">Acceso Administrador</h3>
        {errorMsg && (
          <div className="alert alert-danger p-2 text-center" role="alert">
            {errorMsg}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="admin-form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="admin-form-label">Contraseña</label>
            <input
              type="password"
              className="form-control admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
