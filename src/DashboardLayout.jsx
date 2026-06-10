import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}