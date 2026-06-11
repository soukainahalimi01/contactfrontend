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
      background: "#696c72",
      color: "#1a1a1a",
      padding: "24px 16px",
      minHeight: "100vh",    
      height: "100%",        
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      boxSizing: "border-box",
    }}>
      <h3 style={{
        color: "#1a1a1a",
        fontSize: "15px",
        fontWeight: "600",
        marginBottom: "24px",
        paddingLeft: "8px",
      }}>
        📊 Dashboard
      </h3>

      <Link to="/contacts" style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#1a1a1a",
        textDecoration: "none",
        fontSize: "13px",
        padding: "6px 8px",
        borderRadius: "6px",
        transition: "background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.1)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        📇 Contacts
      </Link>

      <Link to="/users" style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#1a1a1a",
        textDecoration: "none",
        fontSize: "13px",
        padding: "6px 8px",
        borderRadius: "6px",
        transition: "background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.1)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        👤 Users
      </Link>

      <button onClick={logout} style={{
        marginTop: "auto",
        padding: "10px 12px",
        background: "#e53935",
        color: "white",
        border: "none",
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
        onMouseEnter={e => e.currentTarget.style.background = "#c62828"}
        onMouseLeave={e => e.currentTarget.style.background = "#e53935"}
      >
        🚪 Déconnexion
      </button>
    </div>
  );
}