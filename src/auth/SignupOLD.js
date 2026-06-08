import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Signup.css";

const DEPARTMENTS = ["ASSISTANT", "RH", "DEVELOPPEMENT"];

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    departement: "RH",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Prénom requis";
    if (!form.lastName.trim()) e.lastName = "Nom requis";
    if (!form.email.trim()) e.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.password) e.password = "Mot de passe requis";
    else if (form.password.length < 8) e.password = "Min 8 caractères";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Les mots de passe ne correspondent pas";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/users", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        departement: form.departement,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/connexion");
      }, 2000);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Erreur serveur" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="signup-container">
        <div className="signup-card" style={{ textAlign: "center" }}>
          <h2>✔ Compte créé avec succès</h2>
          <p>Vous pouvez maintenant vous connecter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Inscription</h1>
        
        {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            name="firstName"
            placeholder="Prénom"
            value={form.firstName}
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.firstName && <span style={{ color: "red" }}>{errors.firstName}</span>}

          <input
            name="lastName"
            placeholder="Nom"
            value={form.lastName}
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.lastName && <span style={{ color: "red" }}>{errors.lastName}</span>}

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}

          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <span style={{ color: "red" }}>{errors.confirmPassword}</span>}

          <select
            name="departement"
            value={form.departement}
            onChange={handleChange}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <button className="signup-btn" type="submit" disabled={loading}>
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>

        <div className="bottom-link">
          Déjà un compte ? <a href="/connexion">Se connecter</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;