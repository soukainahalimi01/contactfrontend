import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const loadUsers = () => {
    axios.get("http://localhost:8080/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error("Erreur users:", err));
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    if (!window.confirm(`Changer le rôle de ${user.firstName} en ${newRole} ?`)) return;

    try {
      await axios.put(`http://localhost:8080/api/users/${user.id}`, {
        ...user,
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadUsers();
    } catch (err) {
      console.error("Erreur changement rôle:", err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2>👤 Users</h2>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ background: "#2f3542", color: "white" }}>
            <th style={th}>ID</th>
            <th style={th}>Nom</th>
            <th style={th}>Prénom</th>
            <th style={th}>Email</th>
            <th style={th}>Rôle</th>
            <th style={th}>Département</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                Aucun utilisateur trouvé
              </td>
            </tr>
          ) : (
            users.map((u, index) => (
              <tr key={u.id} style={{
                borderBottom: "1px solid #ddd",
                background: index % 2 === 0 ? "#f9f9f9" : "white"
              }}>
                <td style={td}>{u.id}</td>
                <td style={td}>{u.lastName}</td>
                <td style={td}>{u.firstName}</td>
                <td style={td}>{u.email}</td>
                <td style={td}>
                  <span style={{
                    background: u.role === "ADMIN" ? "#e74c3c" : "#95a5a6",
                    color: "white",
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "12px"
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={td}>{u.departement}</td>
                <td style={td}>
                  <button
                    onClick={() => toggleRole(u)}
                    style={{
                      padding: "5px 12px",
                      background: u.role === "ADMIN" ? "#95a5a6" : "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    {u.role === "ADMIN" ? "👤 → USER" : "⭐ → ADMIN"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "12px 16px", textAlign: "left", fontWeight: "bold" };
const td = { padding: "12px 16px" };