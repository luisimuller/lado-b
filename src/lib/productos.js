import { supabase } from "./supabase";

const BUCKET = "fotos";

// Tienda: solo productos publicados.
export async function listarPublicados() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("publicado", true)
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function obtenerProducto(id) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("productos").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

// Panel: todos los productos, publicados o no.
export async function listarTodos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function guardarProducto(producto) {
  const { id, created_at, ...campos } = producto;
  const consulta = id
    ? supabase.from("productos").update(campos).eq("id", id)
    : supabase.from("productos").insert(campos);
  const { error } = await consulta;
  if (error) throw error;
}

export async function borrarProducto(producto) {
  const { error } = await supabase.from("productos").delete().eq("id", producto.id);
  if (error) throw error;
  await Promise.all((producto.fotos || []).map(borrarFoto));
}

export async function subirFoto(archivo) {
  const extension = archivo.name.split(".").pop().toLowerCase();
  const ruta = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(ruta, archivo, {
    cacheControl: "31536000",
    contentType: archivo.type,
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
}

// Borra el archivo de la foto. Si falla no frena nada: la foto ya no aparece en la tienda.
export async function borrarFoto(urlPublica) {
  const ruta = urlPublica.split(`/${BUCKET}/`)[1];
  if (!ruta) return;
  await supabase.storage.from(BUCKET).remove([ruta]);
}
