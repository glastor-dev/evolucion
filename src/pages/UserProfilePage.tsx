import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { sendEmailVerification, reload } from "firebase/auth";
import { getUserProfile, upsertUserProfile, UserProfile } from "../services/userProfile";
import { useToastHelpers } from "../components/ui/toast";
import { NotificationManager } from "../components/ui/NotificationManager";

const UserProfilePage: React.FC = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<UserProfile | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { error: toastError, success: toastSuccess } = useToastHelpers();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const base: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        photoURL: user.photoURL || undefined,
      };
      try {
        const existing = await getUserProfile(user.uid);
        setForm(existing || base);
      } catch (e: any) {
        // Fallback si Firestore no está configurado en local
        setMessage("No se pudo leer el perfil desde la base de datos. Puedes guardar para crearlo.");
        setForm(base);
      }
    };
    load();
  }, [user]);

  if (loading) return <div className="container mx-auto p-6">Cargando...</div>;
  if (!user)
    return (
      <div className="container mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
        <p>Inicia sesión con tu cuenta de Google para gestionar tu perfil.</p>
        <button
          className="bg-gradient-to-r from-[#42B883] to-[#4FC08D] text-black font-semibold py-2 px-4 rounded-lg"
          onClick={async () => {
            try {
              await signInWithGoogle();
              navigate("/perfil");
            } catch (e: any) {
              const msg = e?.message || "No se pudo iniciar sesión";
              setMessage(msg);
              toastError("Inicio de sesión", msg);
            }
          }}
        >
          Iniciar sesión con Google
        </button>
        {message && <div className="text-sm mt-2">{message}</div>}
      </div>
    );
  if (!form) return <div className="container mx-auto p-6">Preparando formulario...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setMessage(null);
    try {
      // Envolver en timeout para evitar bloqueo indefinido si hay problemas de red o reglas
      const withTimeout = <T,>(p: Promise<T>, ms: number) =>
        new Promise<T>((resolve, reject) => {
          const t = setTimeout(() => reject(new Error("timeout")), ms);
          p.then(
            (v) => {
              clearTimeout(t);
              resolve(v);
            },
            (err) => {
              clearTimeout(t);
              reject(err);
            }
          );
        });

      await withTimeout(upsertUserProfile(form), 12000);
      setMessage("Perfil guardado correctamente.");
      toastSuccess("Perfil", "Perfil guardado correctamente");
    } catch (err: any) {
      let msg = err?.message || "Error al guardar el perfil";
      if (msg === "timeout") {
        msg =
          "La operación está tardando demasiado. Verifica tu conexión y las reglas de Firestore para la colección 'users'.";
      }
      setMessage(msg);
      // eslint-disable-next-line no-console
      console.error("Guardar perfil falló", err);
      toastError("Perfil", msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Perfil de Usuario</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled
            className="w-full rounded border border-slate-300 px-3 py-2 bg-slate-100 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="tel"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
          />
        </div>
        <hr className="my-4 opacity-30" />
        <h2 className="text-xl font-semibold">Domicilio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Dirección 1</label>
            <input
              type="text"
              name="addressLine1"
              value={form.addressLine1 || ""}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dirección 2</label>
            <input
              type="text"
              name="addressLine2"
              value={form.addressLine2 || ""}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input
              type="text"
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Provincia/Estado</label>
            <input
              type="text"
              name="state"
              value={form.state || ""}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código postal</label>
            <input
              type="text"
              name="postalCode"
              value={form.postalCode || ""}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">País</label>
            <input
              type="text"
              name="country"
              value={form.country || ""}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
            />
          </div>
        </div>

        <hr className="my-4 opacity-30" />
        <h2 className="text-xl font-semibold flex items-center justify-between">Facturación
          {!user.emailVerified && (
            <span className="text-xs text-amber-400 ml-2">(requiere email verificado)</span>
          )}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">CUIT/RFC/NIF</label>
            <input
              type="text"
              name="taxId"
              value={form.taxId || ""}
              onChange={handleChange}
              disabled={!user.emailVerified}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Razón social / Nombre facturación</label>
            <input
              type="text"
              name="billingName"
              value={form.billingName || ""}
              onChange={handleChange}
              disabled={!user.emailVerified}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Dirección de facturación</label>
            <input
              type="text"
              name="billingAddress"
              value={form.billingAddress || ""}
              onChange={handleChange}
              disabled={!user.emailVerified}
              className="w-full rounded border border-slate-300 px-3 py-2 bg-white text-black"
            />
          </div>
        </div>
        {!user.emailVerified && (
          <div className="text-sm text-slate-300">
            Verifica tu correo para habilitar la edición de facturación.
            <button
              type="button"
              className="ml-2 underline"
              onClick={async () => {
                try {
                  await sendEmailVerification(user);
                  setMessage("Te enviamos un correo de verificación. Actualiza la página cuando lo confirmes.");
                } catch (e: any) {
                  setMessage(e?.message || "No se pudo enviar la verificación");
                }
              }}
            >
              Reenviar verificación
            </button>
            <button
              type="button"
              className="ml-2 underline"
              onClick={async () => {
                try {
                  await reload(user);
                  setMessage("Estado de verificación actualizado.");
                } catch (e: any) {
                  setMessage(e?.message || "No se pudo actualizar el estado");
                }
              }}
            >
              Ya verifiqué, actualizar
            </button>
          </div>
        )}
        <button
          type="submit"
          disabled={busy}
          className="bg-gradient-to-r from-[#42B883] to-[#4FC08D] text-black font-semibold py-2 px-4 rounded-lg disabled:opacity-60"
        >
          {busy ? "Guardando..." : "Guardar"}
        </button>
        {message && <div className="text-sm mt-2">{message}</div>}
      </form>

      {/* Gestor de notificaciones de stock */}
      <div className="mt-8 max-w-xl">
        <NotificationManager 
          userEmail={user.email || undefined}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
