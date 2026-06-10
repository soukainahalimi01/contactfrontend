import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/connexion");
  };

  return (
    <div
      style={{
        width: "220px",
        background: "#2f3542",
        color: "white",
        padding: "20px",
        height: "100vh",
      }}
    >
      <h3>📊 Dashboard</h3>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Link to="/contacts" style={{ color: "white" }}>
          📇 Contacts
        </Link>

        <Link to="/users" style={{ color: "white" }}>
          👤 Users
        </Link>

        <button
          onClick={logout}
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  );
}