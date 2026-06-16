import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/connexion");
  };

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
        color: "white",
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "65px",
        paddingLeft: "15px",
      }}>
        Dashboard
      </h3>

      <Link to="/contacts" style={{
        display: "flex", alignItems: "center", gap: "10px",
        color: "gray", textDecoration: "none", fontSize: "18px",
        padding: "6px 8px", borderRadius: "7px", transition: "background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        📇 Contacts
      </Link>

      <Link to="/users" style={{
        display: "flex", alignItems: "center", gap: "10px",
        color: "gray", textDecoration: "none", fontSize: "20px",
        padding: "6px 8px", borderRadius: "8px", transition: "background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        👤 Users
      </Link>

      <Link to="/profil" style={{
        display: "flex", alignItems: "center", gap: "10px",
        color: "gray", textDecoration: "none", fontSize: "18px",
        padding: "6px 8px", borderRadius: "7px", transition: "background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        Profil
      </Link>

      <button onClick={logout} style={{
        marginTop: "auto",
        padding: "10px 12px",
        background: "rgba(0,0,0,0.2)",
        color: "gray",
        border: "1.5px solid rgba(255,255,255,0.4)",
        borderRadius: "6px",
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
        🚪 Déconnexion
      </button>
    </div>
  );
}