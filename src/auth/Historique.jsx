import React, { useEffect, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";

export default function Historique() {
  const [historiques, setHistoriques] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadHistorique();
  }, []);

  const loadHistorique = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/historique", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistoriques(data);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      field: "username",
      headerName: "User",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => {
        const isCreate = params.value === "CREATION";
        return (
          <Chip
            icon={isCreate ? <AddIcon sx={{ fontSize: 14 }} /> : <EditIcon sx={{ fontSize: 14 }} />}
            label={isCreate ? "CRÉATION" : "MODIFICATION"}
            size="small"
            sx={{
              backgroundColor: isCreate ? "#e1f5ee" : "#e6f1fb",
              color: isCreate ? "#0f6e56" : "#185fa5",
              fontWeight: 500,
              fontSize: 11,
              "& .MuiChip-icon": {
                color: isCreate ? "#0f6e56" : "#185fa5",
              },
            }}
          />
        );
      },
    },
    {
      field: "contactName",
      headerName: "Contact",
      flex: 1,
    },
    {
      field: "oldValue",
      headerName: "Avant",
      flex: 1.5,
      renderCell: (params) =>
        params.value ? (
          <span style={{ fontSize: 12, color: "#666" }}>{params.value}</span>
        ) : (
          <span style={{ color: "#bbb", fontStyle: "italic" }}>—</span>
        ),
    },
    {
      field: "newValue",
      headerName: "Après",
      flex: 1.5,
      renderCell: (params) => (
        <span style={{ fontSize: 12, color: "#666" }}>{params.value}</span>
      ),
    },
    {
      field: "dateAction",
      headerName: "Date",
      width: 200,
      renderCell: (params) => (
        <span style={{ fontSize: 12, fontFamily: "monospace", color: "#888" }}>
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(90deg, #fdba74, #fb923c)",
          px: 2.5,
          py: 1.8,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <HistoryIcon sx={{ color: "#fff", fontSize: 22 }} />
        <Typography sx={{ color: "#fff", fontWeight: 500, fontSize: 18 }}>
          Historique
        </Typography>
      </Box>

      {/* Table */}
      <Box sx={{ flex: 1, px: 2.5, py: 2, overflow: "hidden" }}>
        <Box
          sx={{
            border: "0.5px solid #e0e0e0",
            borderRadius: 2,
            overflow: "hidden",
            height: "100%",
          }}
        >
          <DataGrid
            rows={historiques}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            sx={{
              border: "none",
              fontFamily: "inherit",
              fontSize: 13,
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#111",
                fontWeight: 600,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f9f9f9",
                borderBottom: "0.5px solid #e0e0e0",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#fafafa",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "0.5px solid #f0f0f0",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "0.5px solid #e0e0e0",
                fontSize: 12,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}