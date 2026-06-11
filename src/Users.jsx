import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const loadUsers = () => {
    axios
      .get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Erreur users:", err));
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    if (
      !window.confirm(
        `Changer le rôle de ${user.firstName} en ${newRole} ?`
      )
    )
      return;

    try {
      await axios.put(
        `http://localhost:8080/api/users/${user.id}`,
        {
          ...user,
          role: newRole,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      loadUsers();
    } catch (err) {
      console.error("Erreur changement rôle:", err);
    }
  };

  return (
    <div
      style={{
        padding: "25px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          👤 Users
        </h2>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#b3b3b3",
              color: "#000",
            }}
          >
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
              <td
                colSpan={7}
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#888",
                }}
              >
                Aucun utilisateur trouvé
              </td>
            </tr>
          ) : (
            users.map((u, index) => (
              <tr
                key={u.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  background:
                    index % 2 === 0 ? "#f8f8f8" : "#ffffff",
                }}
              >
                <td style={td}>{u.id}</td>
                <td style={td}>{u.lastName}</td>
                <td style={td}>{u.firstName}</td>
                <td style={td}>{u.email}</td>

                <td style={td}>
                  <span
                    style={{
                      background:
                        u.role === "ADMIN"
                          ? "#e74c3c"
                          : "#95a5a6",
                      color: "white",
                      padding: "5px 12px",
                      borderRadius: "15px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {u.role}
                  </span>
                </td>

                <td style={td}>{u.departement}</td>

                <td style={td}>
                  <button
                    onClick={() => toggleRole(u)}
                    style={{
                      padding: "8px 14px",
                      background:
                        u.role === "ADMIN"
                          ? "#95a5a6"
                          : "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {u.role === "ADMIN"
                      ? "👤 → USER"
                      : "⭐ → ADMIN"}
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

const th = {
  padding: "14px 16px",
  textAlign: "left",
  fontWeight: "bold",
  color: "#000",
  borderRight: "1px solid #d0d0d0",
};

const td = {
  padding: "14px 16px",
};