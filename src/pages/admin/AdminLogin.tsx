import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/i18n/LanguageContext";
import { toast } from "sonner";

export default function AdminLogin() {
  const { signIn, session, isAdmin, loading } = useAuth();
  const { t } = useLang();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && session && isAdmin) {
    const to = (loc.state as any)?.from || "/admin";
    return <Navigate to={to} replace />;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) toast.error(error);
  };

  const input = "w-full bg-card border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3 bg-card border border-border p-8">
        <h1 className="font-serif text-2xl mb-2">{t("admin.login")}</h1>
        {session && !isAdmin && (
          <p className="text-xs text-destructive">{t("admin.login")} —</p>
        )}
        <input className={input} type="email" placeholder={t("fields.email")} value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={input} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={busy} className="w-full bg-charcoal text-cream py-3 text-xs tracking-[0.2em] uppercase hover:bg-charcoal-light disabled:opacity-50">
          {t("cta.submit")}
        </button>
      </form>
    </div>
  );
}
