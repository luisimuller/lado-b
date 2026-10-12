import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { borrarFoto, guardarProducto, obtenerProducto, subirFoto } from "../../lib/productos";
import { SinConfigurar, useAccesoAdmin } from "./Panel";

const VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  coleccion: "",
  fotos: [],
  colores: [{ nombre: "Negro", hex: "#1C1C1C", stock: 1 }],
  publicado: true,
  orden: 0,
};

export default function FormularioProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { configurado, sesion } = useAccesoAdmin();
  const [producto, setProducto] = useState(id ? null : VACIO);
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && sesion) {
      obtenerProducto(id)
        .then((p) => (p ? setProducto(p) : setError("No encontré esa gorra. Volvé al listado.")))
        .catch(() => setError("No se pudo cargar la gorra. Volvé a cargar la página."));
    }
  }, [id, sesion]);

  if (!configurado) return <SinConfigurar />;
  if (sesion === undefined) return <p className="cargando seccion">Cargando…</p>;
  if (!sesion) return <Navigate to="/admin" replace />;
  if (!producto) return <p className="cargando seccion">{error || "Cargando…"}</p>;

  const cambiar = (campo, valor) => setProducto((p) => ({ ...p, [campo]: valor }));

  const cambiarColor = (i, campo, valor) =>
    cambiar(
      "colores",
      producto.colores.map((c, j) => (j === i ? { ...c, [campo]: valor } : c))
    );

  async function alElegirFotos(e) {
    const archivos = [...e.target.files];
    e.target.value = "";
    if (!archivos.length) return;
    setSubiendo(true);
    setError("");
    try {
      const urls = await Promise.all(archivos.map(subirFoto));
      setProducto((p) => ({ ...p, fotos: [...p.fotos, ...urls] }));
    } catch {
      setError("No se pudo subir alguna foto. Probá con un JPG o PNG de menos de 5 MB.");
    }
    setSubiendo(false);
  }

  function quitarFoto(url) {
    cambiar(
      "fotos",
      producto.fotos.filter((f) => f !== url)
    );
    borrarFoto(url);
  }

  function hacerPortada(url) {
    cambiar("fotos", [url, ...producto.fotos.filter((f) => f !== url)]);
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      await guardarProducto({
        ...producto,
        precio: Number(producto.precio),
        orden: Number(producto.orden) || 0,
        colores: producto.colores
          .filter((c) => c.nombre.trim())
          .map((c) => ({ ...c, nombre: c.nombre.trim(), stock: Number(c.stock) || 0 })),
      });
      navigate("/admin");
    } catch {
      setError("No se pudo guardar. Revisá que tenga nombre y precio, y probá de nuevo.");
      setGuardando(false);
    }
  }

  return (
    <section className="seccion admin">
      <div className="admin-cabecera">
        <h1>{id ? "Editar gorra" : "Cargar gorra nueva"}</h1>
        <Link to="/admin" className="boton-texto">
          Volver al listado
        </Link>
      </div>

      <form onSubmit={guardar} className="formulario formulario-producto">
        <label className="campo">
          <span>Nombre</span>
          <input value={producto.nombre} onChange={(e) => cambiar("nombre", e.target.value)} required />
        </label>

        <div className="campos-fila">
          <label className="campo">
            <span>Precio (en pesos, sin puntos)</span>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={producto.precio}
              onChange={(e) => cambiar("precio", e.target.value)}
              required
            />
          </label>
          <label className="campo">
            <span>Colección (opcional)</span>
            <input
              value={producto.coleccion}
              onChange={(e) => cambiar("coleccion", e.target.value)}
              placeholder="Ej.: Primavera 2026"
            />
          </label>
        </div>

        <label className="campo">
          <span>Descripción</span>
          <textarea
            rows="4"
            value={producto.descripcion}
            onChange={(e) => cambiar("descripcion", e.target.value)}
            placeholder="El diseño, el tipo de gorra, la tela, el ajuste…"
          />
        </label>

        <fieldset className="bloque">
          <legend>Fotos</legend>
          <p className="ayuda">La primera es la portada que se ve en la colección.</p>
          <div className="fotos-admin">
            {producto.fotos.map((url, i) => (
              <div key={url} className="foto-admin">
                <img src={url} alt={`Foto ${i + 1}`} />
                <div className="foto-admin-acciones">
                  {i === 0 ? (
                    <span className="foto-portada">Portada</span>
                  ) : (
                    <button type="button" className="boton-texto" onClick={() => hacerPortada(url)}>
                      Usar de portada
                    </button>
                  )}
                  <button type="button" className="boton-texto" onClick={() => quitarFoto(url)}>
                    Quitar
                  </button>
                </div>
              </div>
            ))}
            <label className="subir-foto">
              <input type="file" accept="image/*" multiple onChange={alElegirFotos} disabled={subiendo} />
              <span>{subiendo ? "Subiendo…" : "Agregar fotos"}</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="bloque">
          <legend>Colores y stock</legend>
          <p className="ayuda">Un renglón por cada color de gorra. Con stock 0 se muestra como agotado.</p>
          {producto.colores.map((c, i) => (
            <div key={i} className="fila-color">
              <input
                type="color"
                value={c.hex}
                onChange={(e) => cambiarColor(i, "hex", e.target.value)}
                aria-label={`Tono del color ${i + 1}`}
              />
              <input
                value={c.nombre}
                onChange={(e) => cambiarColor(i, "nombre", e.target.value)}
                placeholder="Nombre del color"
                aria-label={`Nombre del color ${i + 1}`}
              />
              <input
                type="number"
                min="0"
                value={c.stock}
                onChange={(e) => cambiarColor(i, "stock", e.target.value)}
                aria-label={`Stock del color ${i + 1}`}
                className="input-stock"
              />
              <button
                type="button"
                className="boton-texto"
                onClick={() =>
                  cambiar(
                    "colores",
                    producto.colores.filter((_, j) => j !== i)
                  )
                }
              >
                Quitar
              </button>
            </div>
          ))}
          <button
            type="button"
            className="boton boton-secundario boton-chico"
            onClick={() => cambiar("colores", [...producto.colores, { nombre: "", hex: "#F4F1EA", stock: 1 }])}
          >
            Agregar color
          </button>
        </fieldset>

        <div className="campos-fila">
          <label className="campo">
            <span>Orden en la colección (menor aparece primero)</span>
            <input type="number" value={producto.orden} onChange={(e) => cambiar("orden", e.target.value)} />
          </label>
          <label className="campo-check">
            <input
              type="checkbox"
              checked={producto.publicado}
              onChange={(e) => cambiar("publicado", e.target.checked)}
            />
            <span>Publicada en la tienda</span>
          </label>
        </div>

        {error && (
          <p className="aviso" role="alert">
            {error}
          </p>
        )}

        <div className="formulario-acciones">
          <button type="submit" className="boton boton-primario" disabled={guardando || subiendo}>
            {guardando ? "Guardando…" : "Guardar gorra"}
          </button>
          <Link to="/admin" className="boton-texto">
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  );
}
