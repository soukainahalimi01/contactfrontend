import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Alert,
  LinearProgress,
} from "@mui/material";

// ===== COULEURS =====
const ORANGE       = "#c97c3a";
const ORANGE_LIGHT = "#f0e6d6";
const ORANGE_DARK  = "#7a4a1a";

const STORAGE_KEY  = "profil_utilisateur";

// ===== DECODER JWT =====
function getInfosFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return {
      nom:    decoded.lastName  || "",
      prenom: decoded.firstName || "",
      email:  decoded.sub       || "",
      tel:    "",
    };
  } catch (e) {
    return null;
  }
}

export default function Profil() {

  const [nom,    setNom]    = useState("");
  const [prenom, setPrenom] = useState("");
  const [email,  setEmail]  = useState("");
  const [tel,    setTel]    = useState("");
  const [infoMsg, setInfoMsg] = useState(null);

  const [ancienMdp,    setAncienMdp]    = useState("");
  const [nouveauMdp,   setNouveauMdp]   = useState("");
  const [confirmerMdp, setConfirmerMdp] = useState("");
  const [pwdMsg,    setPwdMsg]    = useState(null);
  const [strength,  setStrength]  = useState(0);

  // ===== CHARGEMENT =====
  useEffect(() => {
    const tokenInfos = getInfosFromToken();
    const saved = localStorage.getItem(STORAGE_KEY);
    const profil = saved ? JSON.parse(saved) : (tokenInfos || {});

    setNom(profil.nom       || "");
    setPrenom(profil.prenom || "");
    setEmail(profil.email   || "");
    setTel(profil.tel       || "");
  }, []);

  // ===== AVATAR =====
  const initiales = (nom[0] || "") + (prenom[0] || "");

  // ===== VALIDATIONS =====
  const emailValide = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // ===== FORCE MOT DE PASSE =====
  const calcStrength = (val) => {
    let s = 0;
    if (val.length >= 8)          s++;
    if (/[A-Z]/.test(val))        s++;
    if (/[0-9]/.test(val))        s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    return s;
  };

  const strengthLabel = ["", "Faible", "Moyen", "Fort", "Très fort"];
  const strengthColor = ["", "error", "warning", "success", "success"];

  // ===== ENREGISTRER INFOS =====
  const handleSaveInfo = () => {
    if (!emailValide(email)) {
      setInfoMsg({ type: "error", text: "Email invalide." });
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nom, prenom, email, tel }));
    setInfoMsg({ type: "success", text: "Informations enregistrées avec succès !" });
    setTimeout(() => setInfoMsg(null), 3000);
  };

  // ===== ANNULER INFOS =====
  const handleResetInfo = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const profil = saved ? JSON.parse(saved) : (getInfosFromToken() || {});
    setNom(profil.nom       || "");
    setPrenom(profil.prenom || "");
    setEmail(profil.email   || "");
    setTel(profil.tel       || "");
    setInfoMsg(null);
  };

  // ===== METTRE À JOUR MOT DE PASSE =====
  const handleSavePassword = async () => {
    if (!ancienMdp) {
      setPwdMsg({ type: "error", text: "Ancien mot de passe requis." });
      return;
    }
    if (nouveauMdp.length < 8) {
      setPwdMsg({ type: "error", text: "Min. 8 caractères." });
      return;
    }
    if (nouveauMdp !== confirmerMdp) {
      setPwdMsg({ type: "error", text: "Les mots de passe ne correspondent pas." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ancienMotDePasse: ancienMdp,
          nouveauMotDePasse: nouveauMdp
        })
      });

      if (response.ok) {
        setAncienMdp(""); setNouveauMdp(""); setConfirmerMdp(""); setStrength(0);
        setPwdMsg({ type: "success", text: "Mot de passe mis à jour !" });
      } else {
        const erreur = await response.text();
        setPwdMsg({ type: "error", text: erreur });
      }
    } catch (e) {
      setPwdMsg({ type: "error", text: "Erreur serveur." });
    }

    setTimeout(() => setPwdMsg(null), 3000);
  };

  // ===== ANNULER MOT DE PASSE =====
  const handleResetPassword = () => {
    setAncienMdp(""); setNouveauMdp(""); setConfirmerMdp(""); setStrength(0);
    setPwdMsg(null);
  };

  // ===== RENDER =====
  return (
    <Box sx={{ p: 4, maxWidth: 900 }}>

      {/* ===== CARD : Infos personnelles ===== */}
      <Box sx={{
        bgcolor: "#fff", borderRadius: 2, p: 3, mb: 3,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>

        {/* ===== AVATAR — fo9 mn "Informations personnelles" ===== */}
        <Box sx={{
          display: "flex", alignItems: "center", gap: 2,
          mb: 3, pb: 3,
          borderBottom: `1px solid ${ORANGE_LIGHT}`,
        }}>
          <Avatar sx={{
            width: 64, height: 64,
            bgcolor: ORANGE,
            fontSize: 22, fontWeight: 700,
            boxShadow: "0 2px 8px rgba(201,124,58,0.3)",
          }}>
            {initiales.toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a" }}>
              {nom} {prenom}
            </Typography>
            <Typography sx={{
              fontSize: 12, color: "#fff",
              bgcolor: ORANGE, display: "inline-block",
              px: 1.5, py: 0.3, borderRadius: "20px", mt: 0.5,
            }}>
              Admin
            </Typography>
          </Box>
        </Box>

        <Typography sx={{
          fontWeight: 600, color: ORANGE_DARK,
          mb: 2, pb: 1, borderBottom: `1px solid ${ORANGE_LIGHT}`,
        }}>
          Informations personnelles
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Nom" value={nom} size="small" fullWidth
            onChange={(e) => setNom(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            label="Prénom" value={prenom} size="small" fullWidth
            onChange={(e) => setPrenom(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            label="Email" value={email} size="small" fullWidth type="email"
            onChange={(e) => setEmail(e.target.value)}
            error={email !== "" && !emailValide(email)}
            helperText={email !== "" && !emailValide(email) ? "Email invalide." : ""}
            sx={{ ...inputStyle, gridColumn: "1 / -1" }}
          />
        </Box>

        {infoMsg && (
          <Alert severity={infoMsg.type} sx={{ mt: 2 }}>{infoMsg.text}</Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
          <Button variant="outlined"  onClick={handleResetInfo} sx={btnSecondary}>Annuler</Button>
          <Button variant="contained" onClick={handleSaveInfo}  sx={btnPrimary}>Enregistrer</Button>
        </Box>
      </Box>

      {/* ===== CARD : Mot de passe ===== */}
      <Box sx={{
        bgcolor: "#fff", borderRadius: 2, p: 3,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <Typography sx={{
          fontWeight: 600, color: ORANGE_DARK,
          mb: 2, pb: 1, borderBottom: `1px solid ${ORANGE_LIGHT}`,
        }}>
          Changer mot de passe
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Ancien mot de passe" value={ancienMdp} size="small"
            type="password" fullWidth
            sx={{ ...inputStyle, gridColumn: "1 / -1" }}
            onChange={(e) => setAncienMdp(e.target.value)}
          />
          <Box>
            <TextField
              label="Nouveau mot de passe" value={nouveauMdp} size="small"
              type="password" fullWidth sx={inputStyle}
              onChange={(e) => {
                setNouveauMdp(e.target.value);
                setStrength(calcStrength(e.target.value));
              }}
            />
            {nouveauMdp && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={(strength / 4) * 100}
                  color={strengthColor[strength]}
                  sx={{ mt: 0.5, borderRadius: 1, height: 4 }}
                />
                <Typography sx={{ fontSize: 11, mt: 0.5, color: `${strengthColor[strength]}.main` }}>
                  {strengthLabel[strength]}
                </Typography>
              </>
            )}
          </Box>
          <TextField
            label="Confirmer mot de passe" value={confirmerMdp} size="small"
            type="password" fullWidth sx={inputStyle}
            onChange={(e) => setConfirmerMdp(e.target.value)}
            error={confirmerMdp !== "" && confirmerMdp !== nouveauMdp}
            helperText={confirmerMdp !== "" && confirmerMdp !== nouveauMdp ? "Ne correspond pas." : ""}
          />
        </Box>

        {pwdMsg && (
          <Alert severity={pwdMsg.type} sx={{ mt: 2 }}>{pwdMsg.text}</Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
          <Button variant="outlined"  onClick={handleResetPassword} sx={btnSecondary}>Annuler</Button>
          <Button variant="contained" onClick={handleSavePassword}  sx={btnPrimary}>Mettre à jour</Button>
        </Box>
      </Box>

    </Box>
  );
}

// ===== STYLES =====
const inputStyle = {
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset":       { borderColor: "#c97c3a" },
    "&.Mui-focused fieldset": { borderColor: "#c97c3a" },
  },
  "& label.Mui-focused": { color: "#c97c3a" },
};

const btnPrimary = {
  bgcolor: "#c97c3a", color: "#fff",
  "&:hover": { bgcolor: "#a8612a" },
  textTransform: "none", fontWeight: 500,
};

const btnSecondary = {
  borderColor: "#ddd", color: "#555",
  "&:hover": { borderColor: "#c97c3a", color: "#c97c3a" },
  textTransform: "none",
};