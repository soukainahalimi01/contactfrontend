import { useEffect, useState } from "react";
import axios from "axios";
import PeopleIcon from "@mui/icons-material/People";

const ORANGE = "#f0a857";
const ORANGE_DARK = "#3a2200";

const th = {
  padding: "14px 16px",
  textAlign: "left",
  fontWeight: "700",
  color: "#1a1a1a",
  fontSize: "13px",
  borderRight: "1px solid #f0f0f0",
};

const td = {
  padding: "13px 16px",
  fontSize: "13px",
  color: "#1a1a1a",
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const getCurrentUserFromToken = () => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUserFromToken();

  const isAdmin = currentUser?.role === "ADMIN";
  const currentEmail = currentUser?.sub;

  const loadUsers = () => {
    axios
      .get("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const allUsers = res.data;

        if (isAdmin) {
          setUsers(allUsers);
        } else {
          setUsers(
            allUsers.filter((u) => u.email === currentEmail)
          );
        }
      })
      .catch((err) => {
        console.error("Erreur users :", err);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleRole = async (user) => {
    const newRole =
      user.role === "ADMIN" ? "USER" : "ADMIN";

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadUsers();
    } catch (err) {
      console.error("Erreur changement rôle :", err);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.lastName} ${u.firstName} ${u.email} ${u.role} ${u.departement}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "25px" }}>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px",
          background: `linear-gradient(135deg, #f5d5a8, ${ORANGE})`,
          padding: "14px 20px",
          borderRadius: "8px",
        }}
      >
        <PeopleIcon
          style={{
            color: "white",
            fontSize: "24px",
          }}
        />

        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "500",
            color: "white",
          }}
        >
          Users
        </h2>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="🔍 Rechercher par Nom, Prénom, Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 16px",
            fontSize: "13px",
            border: "1px solid #d0d0d0",
            borderRadius: "8px",
            outline: "none",
            boxSizing: "border-box",
            color: "#1a1a1a",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = ORANGE)
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "#d0d0d0")
          }
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "white",
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              <th style={th}>ID</th>
              <th style={th}>Nom</th>
              <th style={th}>Prénom</th>
              <th style={th}>Email</th>
              <th style={th}>Rôle</th>
              <th style={th}>Département</th>

              {isAdmin && (
                <th style={th}>Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 6}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#aaa",
                    fontSize: "14px",
                  }}
                >
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom:
                      "1px solid #f0f0f0",
                    background: "#ffffff",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "#fdf3e7")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "#ffffff")
                  }
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
                            ? "#fff0e0"
                            : "#f0f0f0",

                        color:
                          u.role === "ADMIN"
                            ? "#b06000"
                            : "#555",

                        padding: "4px 12px",

                        borderRadius: "20px",

                        fontSize: "12px",

                        fontWeight: "600",

                        border:
                          u.role === "ADMIN"
                            ? "1px solid #f0a857"
                            : "1px solid #ccc",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td style={td}>
                    {u.departement}
                  </td>

                  {isAdmin && (
                    <td style={td}>
                      <button
                        onClick={() =>
                          toggleRole(u)
                        }
                        style={{
                          padding: "6px 14px",
                          background:
                            "transparent",

                          color:
                            u.role === "ADMIN"
                              ? "#888"
                              : ORANGE,

                          border: `1px solid ${
                            u.role === "ADMIN"
                              ? "#ccc"
                              : ORANGE
                          }`,

                          borderRadius: "6px",

                          cursor: "pointer",

                          fontSize: "12px",

                          fontWeight: "600",
                        }}
                      >
                        {u.role === "ADMIN"
                          ? "→ USER"
                          : "→ ADMIN"}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}