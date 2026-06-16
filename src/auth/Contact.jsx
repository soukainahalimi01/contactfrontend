import React, { useEffect, useState } from "react";
import {
  Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Tooltip, Tab, Tabs
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const ORANGE = "#f0a857";
const ORANGE_LIGHT = "#f5d5a8";
const ORANGE_DARK = "#3a2200";
const HEADER_BG = "#b0b0b0";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [coordDialog, setCoordDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [coordonnees, setCoordonnees] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [newValeur, setNewValeur] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const [contact, setContact] = useState({
    firstName: "", lastName: "", tel: "", cin: "",
    ville: "", pays: "", adresse: "", email: "",
  });

  const [showTels, setShowTels] = useState(false);
  const [showEmails, setShowEmails] = useState(false);
  const [extraTels, setExtraTels] = useState([]);
  const [extraEmails, setExtraEmails] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => { loadContacts(); }, []);

  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(contacts.filter(c =>
      (c.lastName  || "").toLowerCase().includes(s) ||
      (c.firstName || "").toLowerCase().includes(s) ||
      (c.cin       || "").toLowerCase().includes(s) ||
      (c.email     || "").toLowerCase().includes(s)
    ));
  }, [search, contacts]);

  const loadContacts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error("Erreur chargement contacts:", res.status, await res.text());
        return;
      }
      const data = await res.json();
      setContacts(data);
      setFiltered(data);
    } catch (e) { console.error("Erreur réseau loadContacts:", e); }
  };

  const handleChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });

  const addExtraTel = () => setExtraTels([...extraTels, ""]);
  const removeExtraTel = (i) => setExtraTels(extraTels.filter((_, idx) => idx !== i));
  const changeExtraTel = (i, val) => {
    const arr = [...extraTels]; arr[i] = val; setExtraTels(arr);
  };
  const addExtraEmail = () => setExtraEmails([...extraEmails, ""]);
  const removeExtraEmail = (i) => setExtraEmails(extraEmails.filter((_, idx) => idx !== i));
  const changeExtraEmail = (i, val) => {
    const arr = [...extraEmails]; arr[i] = val; setExtraEmails(arr);
  };
  const resetExtras = () => {
    setExtraTels([]); setExtraEmails([]);
    setShowTels(false); setShowEmails(false);
  };

  const addContact = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(contact),
      });
      if (!res.ok) {
        const errText = await res.text();
        alert(`Erreur ${res.status} : ${errText}`);
        return;
      }
      const created = await res.json();

      for (const tel of extraTels.filter(v => v.trim())) {
        await fetch(`http://localhost:8080/api/coordonnees/${created.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ type: "TEL", valeur: tel, label: "Téléphone" }),
        });
      }
      for (const em of extraEmails.filter(v => v.trim())) {
        await fetch(`http://localhost:8080/api/coordonnees/${created.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ type: "EMAIL", valeur: em, label: "Email" }),
        });
      }

      setOpen(false);
      setContact({ firstName: "", lastName: "", tel: "", cin: "", ville: "", pays: "", adresse: "", email: "" });
      resetExtras();
      loadContacts();
    } catch (e) { console.error("Erreur réseau addContact:", e); }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Supprimer ce contact ?")) return;
    try {
      await fetch(`http://localhost:8080/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadContacts();
    } catch (e) { console.error(e); }
  };

  const openEdit = (row) => {
    setEditContact(row);
    setEditOpen(true);
  };
  const handleEditChange = (e) => setEditContact({ ...editContact, [e.target.name]: e.target.value });

  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/contacts/${editContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editContact),
      });
      if (!res.ok) {
        const errText = await res.text();
        alert(`Erreur ${res.status} : ${errText}`);
        return;
      }
      setEditOpen(false);
      loadContacts();
    } catch (e) { console.error("Erreur réseau saveEdit:", e); }
  };

  const openCoordFromEdit = (tabIndex) => {
    setEditOpen(false);
    setSelectedContact(editContact);
    setActiveTab(tabIndex);
    setCoordDialog(true);
    loadCoordonnees(editContact.id);
  };

  const loadCoordonnees = async (contactId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/coordonnees/contact/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoordonnees(await res.json());
    } catch (e) { console.error(e); }
  };

  const currentType = activeTab === 0 ? "EMAIL" : "TEL";
  const currentList = coordonnees.filter(c => c.type === currentType);

  const addCoord = async () => {
    if (!newValeur) return;
    try {
      await fetch(`http://localhost:8080/api/coordonnees/${selectedContact.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: currentType,
          valeur: newValeur,
          label: newLabel || (activeTab === 0 ? "Email" : "Téléphone"),
        }),
      });
      setNewValeur(""); setNewLabel("");
      loadCoordonnees(selectedContact.id);
    } catch (e) { console.error(e); }
  };

  const deleteCoord = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/coordonnees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadCoordonnees(selectedContact.id);
    } catch (e) { console.error(e); }
  };

  const ellipsisCell = (params) => (
    <span title={params.value} style={{
      overflow: "hidden", textOverflow: "ellipsis",
      whiteSpace: "nowrap", display: "block", width: "100%", fontSize: "13px",
    }}>
      {params.value}
    </span>
  );

  const columns = [
    { field: "id",        headerName: "ID",       width: 55  },
    { field: "lastName",  headerName: "Nom",       width: 110, renderCell: ellipsisCell },
    { field: "firstName", headerName: "Prénom",    width: 110, renderCell: ellipsisCell },
    { field: "tel",       headerName: "Téléphone", width: 175, renderCell: ellipsisCell },
    { field: "cin",       headerName: "CIN",       width: 100, renderCell: ellipsisCell },
    { field: "ville",     headerName: "Ville",     width: 100, renderCell: ellipsisCell },
    { field: "pays",      headerName: "Pays",      width: 100, renderCell: ellipsisCell },
    { field: "adresse",   headerName: "Adresse",   width: 130, renderCell: ellipsisCell },
    { field: "email",     headerName: "Email",     width: 210, renderCell: ellipsisCell },
    {
      field: "actions", headerName: "Actions", width: 155,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
          <button onClick={() => openEdit(params.row)} style={{
            padding: "4px 10px", fontSize: "12px", cursor: "pointer",
            background: "transparent", border: `1px solid ${ORANGE}`,
            borderRadius: "6px", color: ORANGE_DARK, fontWeight: 500,
          }}>✏️ Edit</button>
          <button onClick={() => deleteContact(params.row.id)} style={{
            padding: "4px 10px", fontSize: "12px", cursor: "pointer",
            background: "transparent", border: "1px solid #e24b4a",
            borderRadius: "6px", color: "#a32d2d", fontWeight: 500,
          }}>🗑️ Del</button>
        </Box>
      ),
    },
  ];

  const dialogFieldStyle = {
    "& label.Mui-focused": { color: ORANGE },
    "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: ORANGE } },
  };

  const fields = [
    { label: "Nom",       name: "lastName"  },
    { label: "Prénom",    name: "firstName" },
    { label: "Téléphone", name: "tel"       },
    { label: "CIN",       name: "cin"       },
    { label: "Ville",     name: "ville"     },
    { label: "Pays",      name: "pays"      },
    { label: "Adresse",   name: "adresse"   },
    { label: "Email",     name: "email"     },
  ];

  const eyeBtnStyle = {
    border: "none", background: "transparent",
    cursor: "pointer", fontSize: "18px", marginTop: "8px",
    fontWeight: "700", color: ORANGE,
  };
  const extraRowStyle = {
    background: "transparent", border: "1px solid #e24b4a",
    borderRadius: "6px", color: "#a32d2d", cursor: "pointer",
    fontSize: "16px", padding: "0 6px",
  };
  const addBtnStyle = {
    padding: "6px 14px", background: ORANGE, border: "none",
    borderRadius: "6px", color: ORANGE_DARK, fontWeight: 500,
    cursor: "pointer", fontSize: "12px",
  };

  return (
    <div>
      {/* HEADER */}
      <Box   sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          p: 2,
          borderRadius: "16px",
          background: "linear-gradient(135deg,#f5d5a8,#f0a857)",
          boxShadow: "0 4px 12px rgba(250, 246, 246, 0.08)",
        }}
      >
        <h2 style={{ margin: 0, color: ORANGE_DARK }}>
          📇 Contacts
        </h2>
      
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            border: "1px solid #fff",
            background: "transparent",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + AJOUTER CONTACT
        </button>
      </Box>

      {/* SEARCH */}
      <Box sx={{ mb: 2 }}>
        <input
          type="text"
          placeholder="🔍  Rechercher par Nom, Prénom, CIN, Email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "10px 16px", fontSize: "13px",
            border: "1px solid #d0d0d0", borderRadius: "8px",
            outline: "none", boxSizing: "border-box", color: "#1a1a1a",
          }}
          onFocus={e => e.target.style.borderColor = ORANGE}
          onBlur={e => e.target.style.borderColor = "#d0d0d0"}
        />
      </Box>

 {/* TABLE */}
<Box
  sx={{
    height: 500,
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",

    "& .MuiDataGrid-root": {
      border: "none",
    },

    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#f8f8f8 !important",
      borderBottom: "1px solid #ddd",
    },

    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#f8f8f8 !important",
      color: "#1a1a1a !important",
      fontSize: "14px !important",
      fontWeight: "600 !important",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: "600 !important",
      color: "#1a1a1a !important",
    },

    "& .MuiDataGrid-cell": {
      fontSize: "14px",
      borderBottom: "1px solid #eee",
      display: "flex",
      alignItems: "center",
    },

    "& .MuiDataGrid-columnSeparator": {
      color: "#ddd",
    },

    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#fafafa !important",
    },

    "& .MuiDataGrid-footerContainer": {
      borderTop: "1px solid #eee",
      backgroundColor: "#fff",
    },

    "& .MuiDataGrid-toolbarContainer": {
      padding: "8px",
      borderBottom: "1px solid #eee",
      backgroundColor: "#fff",
    },
  }}
>
  <DataGrid
    rows={filtered}
    columns={columns}
    getRowId={(row) => row.id}
    slots={{ toolbar: GridToolbar }}
    initialState={{
      pagination: {
        paginationModel: { pageSize: 10 },
      },
    }}
    pageSizeOptions={[10, 25, 50]}
  />
</Box>

      {/* ADD DIALOG */}
      <Dialog open={open} onClose={() => { setOpen(false); resetExtras(); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          background: `linear-gradient(135deg, ${ORANGE_LIGHT}, ${ORANGE})`,
          color: ORANGE_DARK, fontWeight: 500, fontSize: "16px",
        }}>➕ Ajouter Contact</DialogTitle>
        <DialogContent>
          {fields.map(f => {
            if (f.name === "tel") return (
              <Box key="tel-block">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField margin="dense" label="Téléphone" name="tel" fullWidth
                    onChange={handleChange} value={contact.tel} sx={dialogFieldStyle} />
                  <Tooltip title="Ajouter d'autres téléphones">
                    <button type="button" onClick={() => setShowTels(!showTels)} style={eyeBtnStyle}>+</button>
                  </Tooltip>
                </Box>
                {showTels && (
                  <Box sx={{ ml: 2, mb: 1 }}>
                    {extraTels.map((val, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <TextField size="small" fullWidth placeholder="Autre téléphone"
                          value={val} onChange={e => changeExtraTel(i, e.target.value)} sx={dialogFieldStyle} />
                        <button type="button" onClick={() => removeExtraTel(i)} style={extraRowStyle}>🗑️</button>
                      </Box>
                    ))}
                    <button type="button" onClick={addExtraTel} style={addBtnStyle}>+ Ajouter téléphone</button>
                  </Box>
                )}
              </Box>
            );
            if (f.name === "email") return (
              <Box key="email-block">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField margin="dense" label="Email" name="email" fullWidth
                    onChange={handleChange} value={contact.email} sx={dialogFieldStyle} />
                  <Tooltip title="Ajouter d'autres emails">
                    <button type="button" onClick={() => setShowEmails(!showEmails)} style={eyeBtnStyle}>+</button>
                  </Tooltip>
                </Box>
                {showEmails && (
                  <Box sx={{ ml: 2, mb: 1 }}>
                    {extraEmails.map((val, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>
                        <TextField size="small" fullWidth placeholder="Autre email"
                          value={val} onChange={e => changeExtraEmail(i, e.target.value)} sx={dialogFieldStyle} />
                        <button type="button" onClick={() => removeExtraEmail(i)} style={extraRowStyle}>🗑️</button>
                      </Box>
                    ))}
                    <button type="button" onClick={addExtraEmail} style={addBtnStyle}>+ Ajouter un email</button>
                  </Box>
                )}
              </Box>
            );
            return (
              <TextField key={f.name} margin="dense" label={f.label} name={f.name}
                fullWidth onChange={handleChange} value={contact[f.name]} sx={dialogFieldStyle} />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetExtras(); }} sx={{ color: "#888" }}>Annuler</Button>
          <Button variant="contained" onClick={addContact}
            sx={{ background: ORANGE, color: ORANGE_DARK, fontWeight: 500, "&:hover": { background: "#e09040" } }}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DIALOG */}
      {editContact && (
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{
            background: `linear-gradient(135deg, ${ORANGE_LIGHT}, ${ORANGE})`,
            color: ORANGE_DARK, fontWeight: 500, fontSize: "16px",
          }}>✏️ Modifier Contact</DialogTitle>
          <DialogContent>
            {fields.map(f => {
              if (f.name === "tel") return (
                <Box key="edit-tel-block">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField margin="dense" label="Téléphone" name="tel" fullWidth
                      onChange={handleEditChange} value={editContact.tel} sx={dialogFieldStyle} />
                    <Tooltip title="Gérer les téléphones">
                      <button type="button" onClick={() => openCoordFromEdit(1)} style={eyeBtnStyle}>+</button>
                    </Tooltip>
                  </Box>
                </Box>
              );
              if (f.name === "email") return (
                <Box key="edit-email-block">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField margin="dense" label="Email" name="email" fullWidth
                      onChange={handleEditChange} value={editContact.email} sx={dialogFieldStyle} />
                    <Tooltip title="Gérer les emails">
                      <button type="button" onClick={() => openCoordFromEdit(0)} style={eyeBtnStyle}>+</button>
                    </Tooltip>
                  </Box>
                </Box>
              );
              return (
                <TextField key={f.name} margin="dense" label={f.label} name={f.name}
                  fullWidth onChange={handleEditChange} value={editContact[f.name]} sx={dialogFieldStyle} />
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)} sx={{ color: "#888" }}>Annuler</Button>
            <Button variant="contained" onClick={saveEdit}
              sx={{ background: ORANGE, color: ORANGE_DARK, fontWeight: 500, "&:hover": { background: "#e09040" } }}>
              Sauvegarder
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* COORDONNEES DIALOG */}
      {selectedContact && (
        <Dialog open={coordDialog} onClose={() => setCoordDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{
            background: `linear-gradient(135deg, ${ORANGE_LIGHT}, ${ORANGE})`,
            color: ORANGE_DARK, fontWeight: 500, fontSize: "16px",
          }}>
            {selectedContact.firstName} {selectedContact.lastName}
          </DialogTitle>

          <Box sx={{ borderBottom: "1px solid #eee" }}>
            <Tabs value={activeTab} onChange={(_, v) => { setActiveTab(v); setNewValeur(""); setNewLabel(""); }}
              sx={{
                "& .MuiTab-root": { fontSize: "13px", textTransform: "none" },
                "& .Mui-selected": { color: `${ORANGE_DARK} !important` },
                "& .MuiTabs-indicator": { backgroundColor: ORANGE },
              }}>
              <Tab label={`📧 Emails (${coordonnees.filter(c => c.type === "EMAIL").length})`} />
              <Tab label={`📞 Téléphones (${coordonnees.filter(c => c.type === "TEL").length})`} />
            </Tabs>
          </Box>

          <DialogContent>
            <Box sx={{ mb: 2 }}>
              {currentList.length === 0 && (
                <p style={{ color: "#888", fontSize: "13px", margin: "8px 0" }}>
                  Aucun {activeTab === 0 ? "email" : "téléphone"} supplémentaire
                </p>
              )}
              {currentList.map((c, i) => (
                <Box key={c.idCoordonnee} sx={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 12px", mb: 1,
                  border: "1px solid #e0e0e0", borderRadius: "6px",
                  background: i % 2 === 0 ? "#fdf3e7" : "#fff",
                }}>
                  <Box sx={{ overflow: "hidden", flex: 1, mr: 1 }}>
                    <span style={{
                      fontSize: "11px", color: "#888", marginRight: "8px",
                      background: "#eee", padding: "2px 6px", borderRadius: "4px",
                    }}>{c.label}</span>
                    <span title={c.valeur} style={{ fontSize: "13px", color: "#1a1a1a" }}>{c.valeur}</span>
                  </Box>
                  <button onClick={() => deleteCoord(c.idCoordonnee)} style={{
                    background: "transparent", border: "1px solid #e24b4a",
                    borderRadius: "6px", color: "#a32d2d", cursor: "pointer",
                    padding: "3px 8px", fontSize: "12px", flexShrink: 0,
                  }}>🗑️</button>
                </Box>
              ))}
            </Box>

            <Box sx={{ borderTop: "1px solid #eee", pt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: ORANGE_DARK }}>
                Ajouter {activeTab === 0 ? "un email" : "un téléphone"} :
              </p>
              <TextField size="small"
                label={activeTab === 0 ? "Email" : "Téléphone"}
                value={newValeur} onChange={e => setNewValeur(e.target.value)}
                fullWidth sx={dialogFieldStyle} />
              <TextField size="small"
                label="Label (ex: Pro, Perso, Mobile...)"
                value={newLabel} onChange={e => setNewLabel(e.target.value)}
                fullWidth sx={dialogFieldStyle} />
              <button onClick={addCoord} style={{
                padding: "8px 16px", background: ORANGE, border: "none",
                borderRadius: "6px", color: ORANGE_DARK, fontWeight: 500,
                cursor: "pointer", fontSize: "13px", alignSelf: "flex-end",
              }}>➕ Ajouter</button>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setCoordDialog(false)} sx={{ color: "#888" }}>Fermer</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}