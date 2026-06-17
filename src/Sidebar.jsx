import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ContactsIcon from "@mui/icons-material/Contacts";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar, Typography, Box } from "@mui/material";

function getInfosFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return { nom: "", prenom: "", role: "" };
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return {
      nom:    decoded.lastName  || "",
      prenom: decoded.firstName || "",
      role:   decoded.role      || "",
    };
  } catch (e) {
    return { nom: "", prenom: "", role: "" };
  }
}

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [userInfo, setUserInfo] = useState({ nom: "", prenom: "", role: "" });

  useEffect(() => {
    setUserInfo(getInfosFromToken());
  }, [location.pathname]);

  const { nom, prenom, role } = userInfo;
  const initiales = (nom[0] || "") + (prenom[0] || "");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/connexion");
  };

  const linkStyle = (path) => ({
    display: "flex", alignItems: "center", gap: "10px",
    color: location.pathname === path ? "#fff" : "rgba(255,255,255,0.75)",
    textDecoration: "none", fontSize: "15px",
    fontWeight: location.pathname === path ? "600" : "400",
    padding: "8px 12px", borderRadius: "8px", transition: "background 0.2s",
    background: location.pathname === path ? "rgba(255,255,255,0.25)" : "transparent",
  });

  return (
    <div style={{
      width: "220px",
      background: "rgb(222 157 96)",
      color: "white",
      padding: "24px 16px",
      minHeight: "100vh",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      boxSizing: "border-box",
    }}>
      <h3 style={{
        color: "white", fontSize: "24px", fontWeight: "700",
        marginBottom: "40px", paddingLeft: "8px",
      }}>
        Dashboard
      </h3>

      <Link to="/contacts" style={linkStyle("/contacts")}
        onMouseEnter={e => { if (location.pathname !== "/contacts") e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
        onMouseLeave={e => { if (location.pathname !== "/contacts") e.currentTarget.style.background = "transparent"; }}
      >
        <ContactsIcon fontSize="small" /> Contacts
      </Link>

      <Link to="/users" style={linkStyle("/users")}
        onMouseEnter={e => { if (location.pathname !== "/users") e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
        onMouseLeave={e => { if (location.pathname !== "/users") e.currentTarget.style.background = "transparent"; }}
      >
        <PeopleIcon fontSize="small" /> Users
      </Link>

      <Link to="/profil" style={linkStyle("/profil")}
        onMouseEnter={e => { if (location.pathname !== "/profil") e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
        onMouseLeave={e => { if (location.pathname !== "/profil") e.currentTarget.style.background = "transparent"; }}
      >
        <PersonIcon fontSize="small" /> Profil
      </Link>

      {/* ===== AVATAR FO9 MN DECONNEXION ===== */}
      <Box sx={{
        marginTop: "auto",
        mb: 1.5,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 8px",
        borderTop: "1px solid rgba(255,255,255,0.2)",
        paddingTop: "14px",
      }}>
        <Avatar sx={{
          width: 38, height: 38,
          bgcolor: "rgba(255,255,255,0.25)",
          color: "#fff",
          fontSize: 14, fontWeight: 700,
          border: "2px solid rgba(255,255,255,0.5)",
        }}>
          {initiales.toUpperCase()}
        </Avatar>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>
            {nom} {prenom}
          </Typography>
          {role && (
            <Typography sx={{
              fontSize: 10, color: "#fff",
              bgcolor: "rgba(255,255,255,0.25)",
              display: "inline-block",
              px: 1, py: 0.2, borderRadius: "20px", mt: 0.3,
              textTransform: "capitalize",
            }}>
              {role}
            </Typography>
          )}
        </Box>
      </Box>

      <button onClick={logout} style={{
        padding: "10px 12px",
        background: "rgba(0,0,0,0.2)",
        color: "rgba(255,255,255,0.85)",
        border: "1.5px solid rgba(255,255,255,0.4)",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.35)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.2)"}
      >
        <LogoutIcon fontSize="small" /> Déconnexion
      </button>
    </div>
  );
}