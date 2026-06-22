import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, TextField, Typography,
  IconButton, InputAdornment, Link, Divider, Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email invalide";
    if (!form.password) e.password = "Mot de passe requis";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      const decoded = jwtDecode(token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("firstName", decoded.firstName || "");
      localStorage.setItem("lastName", decoded.lastName || "");

      navigate("/");
    } catch (err) {
      if (err.response) {
        setErrors({ api: err.response.data?.message || "Email ou mot de passe incorrect" });
      } else {
        setErrors({ api: "Serveur indisponible" });
      }
    } finally {
      setLoading(false);
    }
  };

  const orangeColor = "#f0831e";

  const orangeFieldStyle = {
    '& label': { color: orangeColor },
    '& label.Mui-focused': { color: orangeColor },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fffde7',
      '& fieldset': { borderColor: orangeColor },
      '&:hover fieldset': { borderColor: orangeColor },
      '&.Mui-focused fieldset': { borderColor: orangeColor },
    },
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 30%, #f0831e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box sx={{
        width: '100%',
        maxWidth: 460,
        p: 4,
        border: '2px solid',
        borderColor: orangeColor,
        borderRadius: 5,
        background: "white",
      }}>
        <Typography variant="h5" fontWeight={500} gutterBottom>Connexion</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Saisissez vos identifiants pour continuer
        </Typography>

        {errors.api && <Alert severity="error" sx={{ mb: 2 }}>{errors.api}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={orangeFieldStyle}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            sx={orangeFieldStyle}
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

          <Box textAlign="right" mt={1}>
            <Link href="#" variant="body2" sx={{ color: orangeColor }}>
              Mot de passe oublié
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              background: orangeColor,
              '&:hover': { background: "#d4701a" },
            }}
            disabled={loading}
          >
            {loading ? "Connexion..." : "SE CONNECTER"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" textAlign="center">
          Vous n'avez pas de compte ?{' '}
          <Link href="/inscription" sx={{ color: orangeColor }}>S'inscrire</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;