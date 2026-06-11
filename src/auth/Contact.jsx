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
      const data = await res.json();
      setContacts(data);
      setFiltered(data);
    } catch (e) { console.error(e); }
  };

  const handleChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });

  const addContact = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(contact),
      });
      if (!res.ok) throw new Error();
      setOpen(false);
      setContact({ firstName: "", lastName: "", tel: "", cin: "", ville: "", pays: "", adresse: "", email: "" });
      loadContacts();
    } catch (e) { console.error(e); }
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

  const openEdit = (row) => { setEditContact(row); setEditOpen(true); };
  const handleEditChange = (e) => setEditContact({ ...editContact, [e.target.name]: e.target.value });

  const saveEdit = async () => {
    try {
      await fetch(`http://localhost:8080/api/contacts/${editContact.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editContact),
      });
      setEditOpen(false);
      loadContacts();
    } catch (e) { console.error(e); }
  };

  const openCoordDialog = async (row, tabIndex) => {
    setSelectedContact(row);
    setActiveTab(tabIndex);
    setCoordDialog(true);
    await loadCoordonnees(row.id);
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
      setNewValeur("");
      setNewLabel("");
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

  const PlusBtn = ({ row, tabIndex }) => (
    <Tooltip title={tabIndex === 0 ? "Gérer emails" : "Gérer téléphones"}>
      <button onClick={() => openCoordDialog(row, tabIndex)} style={{
        padding: "1px 6px", fontSize: "15px", cursor: "pointer",
        background: ORANGE_LIGHT, border: `1px solid ${ORANGE}`,
        borderRadius: "50%", color: ORANGE_DARK, fontWeight: 700,
        lineHeight: 1.3, minWidth: "22px", flexShrink: 0,
      }}>+</button>
    </Tooltip>
  );

  const columns = [
    { field: "id",        headerName: "ID",      width: 55  },
    { field: "lastName",  headerName: "Nom",      width: 110, renderCell: ellipsisCell },
    { field: "firstName", headerName: "Prénom",   width: 110, renderCell: ellipsisCell },
    {
      field: "tel", headerName: "Téléphone", width: 175,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%", overflow: "hidden", width: "100%" }}>
          <span title={params.row.tel} style={{
            fontSize: "13px", flex: 1, overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {params.row.tel}
          </span>
          <PlusBtn row={params.row} tabIndex={1} />
        </Box>
      ),
    },
    { field: "cin",     headerName: "CIN",     width: 100, renderCell: ellipsisCell },
    { field: "ville",   headerName: "Ville",   width: 100, renderCell: ellipsisCell },
    { field: "pays",    headerName: "Pays",    width: 100, renderCell: ellipsisCell },
    { field: "adresse", headerName: "Adresse", width: 130, renderCell: ellipsisCell },
    {
      field: "email", headerName: "Email", width: 210,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%", overflow: "hidden", width: "100%" }}>
          <span title={params.row.email} style={{
            fontSize: "13px", flex: 1, overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {params.row.email}
          </span>
          <PlusBtn row={params.row} tabIndex={0} />
        </Box>
      ),
    },
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

  return (
    <div>
      {/* HEADER */}
      <Box sx={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        mb: 2, px: 2, py: 1.5,
        background: `linear-gradient(135deg, ${ORANGE_LIGHT}, ${ORANGE})`,
        borderRadius: "8px",
      }}>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 500, color: ORANGE_DARK }}>
          📇 Contacts
        </h2>
        <button onClick={() => setOpen(true)} style={{
          padding: "7px 16px", fontSize: "12px", fontWeight: 500, cursor: "pointer",
          background: "transparent", border: `1.5px solid ${ORANGE_DARK}`,
          borderRadius: "6px", color: ORANGE_DARK, letterSpacing: "0.04em",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          ➕ AJOUTER CONTACT
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
      <Box sx={{
        height: 500, width: "100%",
        border: "1px solid #d0d0d0", borderRadius: "8px", overflow: "hidden",
        "& .MuiDataGrid-columnHeaders": { backgroundColor: `${HEADER_BG} !important` },
        "& .MuiDataGrid-columnHeader": { backgroundColor: `${HEADER_BG} !important`, color: "#1a1a1a !important", fontSize: "12px !important" },
        "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "500 !important", color: "#1a1a1a !important" },
        "& .MuiDataGrid-row:hover": { backgroundColor: "#fdf3e7 !important" },
        "& .MuiDataGrid-cell": {
          fontSize: "13px",
          overflow: "hidden !important",
          display: "flex !important",
          alignItems: "center !important",
        },
        "& .MuiDataGrid-filler": { backgroundColor: `${HEADER_BG} !important` },
        "& .MuiDataGrid-scrollbarFiller": { backgroundColor: `${HEADER_BG} !important` },
      }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{ toolbar: GridToolbar }}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>

      {/* ADD DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          background: `linear-gradient(135deg, ${ORANGE_LIGHT}, ${ORANGE})`,
          color: ORANGE_DARK, fontWeight: 500, fontSize: "16px",
        }}>➕ Ajouter Contact</DialogTitle>
        <DialogContent>
          {fields.map(f => (
            <TextField key={f.name} margin="dense" label={f.label} name={f.name}
              fullWidth onChange={handleChange} value={contact[f.name]} sx={dialogFieldStyle} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "#888" }}>Annuler</Button>
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
            {fields.map(f => (
              <TextField key={f.name} margin="dense" label={f.label} name={f.name}
                fullWidth onChange={handleEditChange} value={editContact[f.name]} sx={dialogFieldStyle} />
            ))}
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
            {/* Liste */}
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
                    }}>
                      {c.label}
                    </span>
                    <span title={c.valeur} style={{
                      fontSize: "13px", color: "#1a1a1a",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {c.valeur}
                    </span>
                  </Box>
                  <button onClick={() => deleteCoord(c.idCoordonnee)} style={{
                    background: "transparent", border: "1px solid #e24b4a",
                    borderRadius: "6px", color: "#a32d2d", cursor: "pointer",
                    padding: "3px 8px", fontSize: "12px", flexShrink: 0,
                  }}>🗑️</button>
                </Box>
              ))}
            </Box>

            {/* Ajouter */}
            <Box sx={{ borderTop: "1px solid #eee", pt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: 500, color: ORANGE_DARK }}>
                Ajouter {activeTab === 0 ? "un email" : "un téléphone"} :
              </p>
              <TextField size="small"
                label={activeTab === 0 ? "Email" : "Téléphone"}
                value={newValeur}
                onChange={e => setNewValeur(e.target.value)}
                fullWidth sx={dialogFieldStyle}
              />
              <TextField size="small"
                label="Label (ex: Pro, Perso, Mobile...)"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                fullWidth sx={dialogFieldStyle}
              />
              <button onClick={addCoord} style={{
                padding: "8px 16px", background: ORANGE, border: "none",
                borderRadius: "6px", color: ORANGE_DARK, fontWeight: 500,
                cursor: "pointer", fontSize: "13px", alignSelf: "flex-end",
              }}>
                ➕ Ajouter
              </button>
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