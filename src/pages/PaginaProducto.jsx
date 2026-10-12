import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePedido } from "../context/PedidoContext";
import { estaAgotado, precio } from "../lib/formato";
import { obtenerProducto } from "../lib/productos";

export default function PaginaProducto() {
  const { id } = useParams();
  const pedido = usePedido();
  const [producto, setProducto] = useState(undefined);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [color, setColor] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    obtenerProducto(id)
      .then((p) => {
        setProducto(p);
        const primeroConStock = p?.colores?.find((c) => Number(c.stock) > 0);
        setColor(primeroConStock?.nombre ?? null);
      })
      .catch(() => setProducto(null));
  }, [id]);

  if (producto === undefined) return <p className="cargando seccion">Cargando gorra…</p>;

  if (!producto || !producto.publicado) {
    return (
      <section className="seccion vacio">
        <h1>Esta gorra no está disponible</h1>
        <p>Puede que se haya agotado o que el link esté mal escrito.</p>
        <Link to="/#coleccion" className="boton boton-secundario">
          Ver la colección
        </Link>
      </section>
    );
  }

  const colores = producto.colores || [];
  const colorElegido = colores.find((c) => c.nombre === color);
  const maximo = colorElegido ? Number(colorElegido.stock) : colores.length ? 0 : undefined;
  const agotado = estaAgotado(producto);
  const puedeAgregar = !agotado && (colores.length === 0 || (colorElegido && maximo > 0));
  const fotos = producto.fotos || [];

  function agregar() {
    pedido.agregar(producto, color, cantidad, maximo);
    setAgregado(true);
    pedido.abrir();
  }

  return (
    <section className="seccion producto">
      <div className="producto-fotos">
        <div className="producto-foto-principal">
          {fotos.length ? (
            <img src={fotos[fotoActiva]} alt={`${producto.nombre}, foto ${fotoActiva + 1}`} />
          ) : (
            <span className="tarjeta-sin-foto">Foto en camino</span>
          )}
        </div>
        {fotos.length > 1 && (
          <div className="producto-miniaturas">
            {fotos.map((foto, i) => (
              <button
                key={foto}
                type="button"
                className="miniatura"
                aria-pressed={i === fotoActiva}
                aria-label={`Ver foto ${i + 1}`}
                onClick={() => setFotoActiva(i)}
              >
                <img src={foto} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="producto-info">
        {producto.coleccion && <p className="producto-coleccion">{producto.coleccion}</p>}
        <h1 className="producto-nombre">{producto.nombre}</h1>
        <p className="producto-precio">{precio(producto.precio)}</p>
        {producto.descripcion && <p className="producto-descripcion">{producto.descripcion}</p>}

        {colores.length > 0 && (
          <fieldset className="selector-color">
            <legend>Color de gorra: {color || "elegí uno"}</legend>
            <div className="selector-color-opciones">
              {colores.map((c) => {
                const sinStock = Number(c.stock) <= 0;
                return (
                  <label key={c.nombre} className={`opcion-color ${sinStock ? "sin-stock" : ""}`}>
                    <input
                      type="radio"
                      name="color"
                      value={c.nombre}
                      checked={color === c.nombre}
                      disabled={sinStock}
                      onChange={() => {
                        setColor(c.nombre);
                        setCantidad(1);
                      }}
                    />
                    <span className="opcion-color-muestra" style={{ background: c.hex }} />
                    <span>
                      {c.nombre}
                      {sinStock && " · agotado"}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {puedeAgregar && (
          <div className="producto-cantidad">
            <span id="cantidad-etiqueta">Cantidad</span>
            <div className="cantidad" aria-labelledby="cantidad-etiqueta">
              <button
                type="button"
                onClick={() => setCantidad((n) => Math.max(1, n - 1))}
                aria-label="Restar una"
              >
                −
              </button>
              <span>{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad((n) => (maximo ? Math.min(maximo, n + 1) : n + 1))}
                disabled={maximo != null && cantidad >= maximo}
                aria-label="Sumar una"
              >
                +
              </button>
            </div>
            {maximo != null && maximo <= 3 && <span className="producto-stock">Quedan {maximo}</span>}
          </div>
        )}

        <button type="button" className="boton boton-primario boton-ancho" onClick={agregar} disabled={!puedeAgregar}>
          {agotado ? "Agotada" : "Agregar al pedido"}
        </button>
        {agregado && <p className="producto-confirmacion" role="status">Agregada a tu pedido.</p>}

        <p className="producto-nota">
          Bordada a mano: cada pieza puede tener pequeñas diferencias con la foto.
        </p>
      </div>
    </section>
  );
}
