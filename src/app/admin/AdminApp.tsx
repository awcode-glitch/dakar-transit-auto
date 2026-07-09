import { Routes, Route, Navigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../lib/useAuth";
import { COLORS } from "../../lib/shared";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout } from "./AdminLayout";
import { VehicleList } from "./VehicleList";
import { VehicleForm } from "./VehicleForm";
import { AdminAccount } from "./AdminAccount";

function AdminSplash() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.nuit }}>
      <Loader2 size={24} className="animate-spin" style={{ color: "rgba(255,255,255,0.6)" }} />
    </div>
  );
}

export default function AdminApp() {
  const { session, loading } = useAuth();

  if (loading) return <AdminSplash />;

  return (
    <Routes>
      <Route
        path="login"
        element={session ? <Navigate to="/admin/vehicules" replace /> : <AdminLogin />}
      />
      <Route
        path="*"
        element={session ? <AdminLayout /> : <Navigate to="/admin/login" replace />}
      >
        <Route index element={<Navigate to="vehicules" replace />} />
        <Route path="vehicules" element={<VehicleList />} />
        <Route path="vehicules/nouveau" element={<VehicleForm mode="create" />} />
        <Route path="vehicules/:id" element={<VehicleForm mode="edit" />} />
        <Route path="compte" element={<AdminAccount />} />
        <Route path="*" element={<Navigate to="vehicules" replace />} />
      </Route>
    </Routes>
  );
}
