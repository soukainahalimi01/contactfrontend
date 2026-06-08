import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, TextField, Typography,
  IconButton, InputAdornment, Link, Divider, Alert,
  MenuItem, Select, FormControl, InputLabel, FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Prénom requis";
    if (!form.lastName.trim()) e.lastName = "Nom requis";
    if (!form.email.trim()) e.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email invalide";
    if (!form.password) e.password = "Mot de passe requis";
    else if (form.password.length < 8) e.password = "Min 8 caractères";
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
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

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
      setTimeout(() => navigate("/connexion"), 2000);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Erreur serveur" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4, border: "1px solid", borderColor: "#efaa73ff", borderRadius: 2, background: "white", textAlign: "center" }}>
        <Typography variant="h6" fontWeight={500} gutterBottom>✔ Compte créé avec succès</Typography>
        <Typography variant="body2" color="text.secondary">
          Vous pouvez maintenant vous connecter.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4, border: "1px solid", borderColor: "#efaa73ff", borderRadius: 2, background: "white" }}>
      <Typography variant="h5" fontWeight={500} sx={{textTransform:"uppercase", letterSpacing: "2px"}} gutterBottom>Inscription</Typography>


      {errors.api && <Alert severity="error" sx={{ mb: 2 }}>{errors.api}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
        <TextField
          size="small"
          label="Prénom"
          name="firstName"
          fullWidth
          margin="normal"
          value={form.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          autoComplete="off"
        />

        <TextField
          size="small"
          label="Nom"
          name="lastName"
          fullWidth
          margin="normal"
          value={form.lastName}
          onChange={handleChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          autoComplete="off"
        />

        <TextField
          size="small"
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          autoComplete="off"
        />

        <TextField
          size="small"
          label="Mot de passe"
          name="password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          label="Confirmer le mot de passe"
          name="confirmPassword"
          type={showConfirm ? "text" : "password"}
          fullWidth
          margin="normal"
          value={form.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          autoComplete="new-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControl fullWidth margin="normal" size="small" error={!!errors.departement}>
          <InputLabel>Département</InputLabel>
          <Select
            name="departement"
            value={form.departement}
            label="Département"
            onChange={handleChange}
          >
            {DEPARTMENTS.map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
          </Select>
          {errors.departement && <FormHelperText>{errors.departement}</FormHelperText>}
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, background: "#f0831e", "&:hover": { background: "#d9731a" } }}
          disabled={loading}
        >
          {loading ? "Chargement..." : "S'INSCRIRE"}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body2" textAlign="center">
        Vous avez déjà un compte ?{" "}
        <Link href="/connexion" sx={{ color: "#f0831e" }}>SE CONNECTER</Link>
      </Typography>
    </Box>
  );
}

export default Signup;
