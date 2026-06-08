import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
  console.log("ProtectedRoute RENDERED"); // 👈 زيد هاد

  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  if (!token) {
    console.log("NO TOKEN -> redirect");
    return <Navigate to="/connexion" replace />;
  }

  console.log("TOKEN OK -> allow access");
  return children;
}
export default ProtectedRoute;