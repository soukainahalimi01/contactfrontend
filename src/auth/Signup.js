import React, { useState } from "react";
import axios from "axios";

const DEPARTMENTS = ["ASSISTANT", "RH", "DEVELOPPEMENT"];

function Signup() {
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
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.firstName.trim()) e.firstName = "Prénom requis";
    if (!form.lastName.trim()) e.lastName = "Nom requis";

    if (!form.email.trim()) e.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email invalide";

    if (!form.password) e.password = "Mot de passe requis";
    else if (form.password.length < 8)
      e.password = "Min 8 caractères";

    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Les mots de passe ne correspondent pas";

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

    } catch (err) {
      if (err.response) {
        setErrors({ api: err.response.data?.message || "Erreur serveur" });
      } else {
        setErrors({ api: "Serveur indisponible" });
      }
    } finally {
      setLoading(false);
    }
  }; // ✅ accolade fermante de handleSubmit

  // ✅ success page
  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>✔ Compte créé avec succès</h2>
          <p>Vous pouvez maintenant vous connecter.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>👤 Inscription</h2>

        {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="firstName"
            placeholder="Prénom"
            value={form.firstName}
            onChange={handleChange}
          />
          <p style={styles.err}>{errors.firstName}</p>

          <input
            name="lastName"
            placeholder="Nom"
            value={form.lastName}
            onChange={handleChange}
          />
          <p style={styles.err}>{errors.lastName}</p>

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <p style={styles.err}>{errors.email}</p>

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)}>
              👁
            </button>
          </div>
          <p style={styles.err}>{errors.password}</p>

          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmer mot de passe"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
              👁
            </button>
          </div>
          <p style={styles.err}>{errors.confirmPassword}</p>

          <select
            name="departement"
            value={form.departement}
            onChange={handleChange}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button disabled={loading} type="submit">
            {loading ? "Création..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f6fa",
  },
  card: {
    padding: 20,
    background: "white",
    borderRadius: 10,
    width: 350,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  err: {
    color: "red",
    fontSize: 12,
  },
};

export default Signup;