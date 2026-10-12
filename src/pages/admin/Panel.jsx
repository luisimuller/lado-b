import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { precio, stockTotal } from "../../lib/formato";
import { borrarProducto, listarTodos } from "../../lib/productos";
import { supabase, supabaseConfigurado } from "../../lib/supabase";
import { useSesion } from "../../lib/useSesion";

export function SinConfigurar() {
  return (
    <section className="seccion admin">
      <h1>Falta conectar la base de datos</h1>
      <p>
        Completá <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en el archivo <code>.env</code>{" "}
        (o en las variables de entorno de Vercel) y volvé a cargar la página.
      </p>
    </section>
  );
}

function Ingreso() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setEnviando(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: clave });
    if (error) setError("El email o la contraseña no coinciden. Revisalos y probá de nuevo.");
    setEnviando(false);
  }

  return (
    <section className="seccion admin admin-ingreso">
      <h1>Entrar al panel</h1>
      <form onSubmit={entrar} className="formulario">
        <label className="campo">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </label>
        <label className="campo">
          <span>Contraseña</span>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="aviso" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="boton boton-primario" disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </section>
  );
}

function Listado() {
  const [productos, setProductos] = useState(null);
  const [error, setError] = useState("");

  const cargar = () =>
    listarTodos()
      .then(setProductos)
      .catch(() => setError("No se pudieron cargar los productos. Volvé a cargar la página."));

  useEffect(() => {
    cargar();
  }, []);

  async function borrar(producto) {
    if (!confirm(`¿Borrar "${producto.nombre}"? También se borran sus fotos. No se puede deshacer.`)) return;
    try {
      await borrarProducto(producto);
      cargar();
    } catch {
      setError("No se pudo borrar el producto. Probá de nuevo.");
    }
  }

  return (
    <section className="seccion admin">
      <div className="admin-cabecera">
        <h1>Productos</h1>
        <div className="admin-acciones">
          <Link to="/admin/nueva" className="boton boton-primario">
            Cargar gorra nueva
          </Link>
          <button type="button" className="boton-texto" onClick={() => supabase.auth.signOut()}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {error && <p className="aviso">{error}</p>}

      {productos === null ? (
        <p className="cargando">Cargando…</p>
      ) : productos.length === 0 ? (
        <div className="vacio-admin">
          <p>Todavía no cargaste ninguna gorra. Mientras tanto, la tienda muestra lugares de "Próximamente".</p>
        </div>
      ) : (
        <ul className="admin-lista">
          {productos.map((p) => (
            <li key={p.id} className="admin-fila">
              <div className="admin-foto">{p.fotos?.[0] && <img src={p.fotos[0]} alt="" />}</div>
              <div className="admin-datos">
                <p className="admin-nombre">{p.nombre}</p>
                <p className="admin-detalle">
                  {precio(p.precio)} · {stockTotal(p)} en stock · {p.coleccion || "Sin colección"}
                </p>
              </div>
              <span className={`estado ${p.publicado ? "estado-publicado" : ""}`}>
                {p.publicado ? "Publicada" : "Oculta"}
              </span>
              <div className="admin-fila-acciones">
                <Link to={`/admin/editar/${p.id}`} className="boton boton-secundario boton-chico">
                  Editar
                </Link>
                <button type="button" className="boton-texto" onClick={() => borrar(p)}>
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Panel() {
  const sesion = useSesion();
  if (!supabaseConfigurado) return <SinConfigurar />;
  if (sesion === undefined) return <p className="cargando seccion">Cargando…</p>;
  return sesion ? <Listado /> : <Ingreso />;
}

// Para proteger otras pantallas del panel.
export function useAccesoAdmin() {
  const sesion = useSesion();
  return { configurado: supabaseConfigurado, sesion };
}
