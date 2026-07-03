import { NavLink, Outlet, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/i18n/LanguageContext";
import { LogOut } from "lucide-react";

export default function AdminLayout() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const { t } = useLang();

  if (loading) return <div className="py-32 text-center text-muted-foreground">…</div>;
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />;

  const link = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 text-sm border-l-2 ${isActive ? "border-gold text-gold bg-secondary" : "border-transparent text-foreground/70 hover:text-foreground"}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1 md:sticky md:top-24 self-start">
          <div className="mb-4">
            <Link to="/" className="font-serif text-base">{t("brand")}</Link>
            <p className="text-xs text-muted-foreground">{t("admin.dashboard")}</p>
          </div>
          <NavLink end to="/admin" className={link}>{t("admin.dashboard")}</NavLink>
          <NavLink to="/admin/artworks" className={link}>{t("admin.artworks")}</NavLink>
          <NavLink to="/admin/viewings" className={link}>{t("admin.viewings")}</NavLink>
          <NavLink to="/admin/tbc" className={link}>{t("admin.tbcRequests")}</NavLink>
          <NavLink to="/admin/periods" className={link}>{t("admin.periods")}</NavLink>
          <button
            onClick={signOut}
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-4"
          >
            <LogOut size={14} /> {t("admin.signOut")}
          </button>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
