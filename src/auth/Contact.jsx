import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function Contacts() {

  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editContact, setEditContact] = useState(null);

  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    tel: "",
    cin: "",
    ville: "",
    pays: "",
    adresse: "",
    email: "",
  });

  const token = localStorage.getItem("token");

  // ================= LOAD CONTACTS =================
  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line
  }, []);

  const loadContacts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Erreur load contacts:", error);
    }
  };

  // ================= HANDLE INPUT ADD =================
  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // ================= ADD CONTACT =================
  const addContact = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) throw new Error("Erreur ajout contact");

      setOpen(false);
      setContact({
        firstName: "", lastName: "", tel: "", cin: "",
        ville: "", pays: "", adresse: "", email: "",
      });
      loadContacts();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= DELETE CONTACT =================
  const deleteContact = async (id) => {
    if (!window.confirm("Supprimer ce contact ?")) return;
    try {
      await fetch(`http://localhost:8080/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadContacts();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  // ================= EDIT CONTACT =================
  const openEdit = (row) => {
    setEditContact(row);
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    setEditContact({ ...editContact, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      await fetch(`http://localhost:8080/api/contacts/${editContact.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editContact),
      });
      setEditOpen(false);
      loadContacts();
    } catch (error) {
      console.error("Erreur modification:", error);
    }
  };

  // ================= COLUMNS =================
  const columns = [
    { field: "id",        headerName: "ID",        width: 70  },
    { field: "lastName",  headerName: "Nom",        width: 130 },
    { field: "firstName", headerName: "Prénom",     width: 130 },
    { field: "tel",       headerName: "Téléphone",  width: 130 },
    { field: "cin",       headerName: "CIN",        width: 120 },
    { field: "ville",     headerName: "Ville",      width: 120 },
    { field: "pays",      headerName: "Pays",       width: 120 },
    { field: "adresse",   headerName: "Adresse",    width: 180 },
    { field: "email",     headerName: "Email",      width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => openEdit(params.row)}
          >
            ✏️ Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteContact(params.row.id)}
          >
            🗑️ Del
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <div>

      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h2>📇 Contacts</h2>
        <Button variant="contained" onClick={() => setOpen(true)}>
          ➕ Ajouter Contact
        </Button>
      </Box>

      {/* TABLE */}
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={contacts}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>

      {/* ADD DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>➕ Ajouter Contact</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nom"       name="lastName"  fullWidth onChange={handleChange} value={contact.lastName}  />
          <TextField margin="dense" label="Prénom"    name="firstName" fullWidth onChange={handleChange} value={contact.firstName} />
          <TextField margin="dense" label="Téléphone" name="tel"       fullWidth onChange={handleChange} value={contact.tel}       />
          <TextField margin="dense" label="CIN"       name="cin"       fullWidth onChange={handleChange} value={contact.cin}       />
          <TextField margin="dense" label="Ville"     name="ville"     fullWidth onChange={handleChange} value={contact.ville}     />
          <TextField margin="dense" label="Pays"      name="pays"      fullWidth onChange={handleChange} value={contact.pays}      />
          <TextField margin="dense" label="Adresse"   name="adresse"   fullWidth onChange={handleChange} value={contact.adresse}   />
          <TextField margin="dense" label="Email"     name="email"     fullWidth onChange={handleChange} value={contact.email}     />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button variant="contained" onClick={addContact}>Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DIALOG */}
      {editContact && (
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>✏️ Modifier Contact</DialogTitle>
          <DialogContent>
            <TextField margin="dense" label="Nom"       name="lastName"  fullWidth onChange={handleEditChange} value={editContact.lastName}  />
            <TextField margin="dense" label="Prénom"    name="firstName" fullWidth onChange={handleEditChange} value={editContact.firstName} />
            <TextField margin="dense" label="Téléphone" name="tel"       fullWidth onChange={handleEditChange} value={editContact.tel}       />
            <TextField margin="dense" label="CIN"       name="cin"       fullWidth onChange={handleEditChange} value={editContact.cin}       />
            <TextField margin="dense" label="Ville"     name="ville"     fullWidth onChange={handleEditChange} value={editContact.ville}     />
            <TextField margin="dense" label="Pays"      name="pays"      fullWidth onChange={handleEditChange} value={editContact.pays}      />
            <TextField margin="dense" label="Adresse"   name="adresse"   fullWidth onChange={handleEditChange} value={editContact.adresse}   />
            <TextField margin="dense" label="Email"     name="email"     fullWidth onChange={handleEditChange} value={editContact.email}     />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Annuler</Button>
            <Button variant="contained" onClick={saveEdit}>Sauvegarder</Button>
          </DialogActions>
        </Dialog>
      )}

    </div>
  );
}