import { useEffect, useState } from "react";
import { supabase } from "./supabase";

// Devuelve undefined mientras carga, null si no hay sesión, o la sesión activa.
export function useSesion() {
  const [sesion, setSesion] = useState(undefined);

  useEffect(() => {
    if (!supabase) {
      setSesion(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSesion(data.session));
    const { data } = supabase.auth.onAuthStateChange((_evento, nueva) => setSesion(nueva));
    return () => data.subscription.unsubscribe();
  }, []);

  return sesion;
}
