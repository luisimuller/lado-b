import { useEffect, useRef } from "react";
import { usePedido } from "../context/PedidoContext";
import { precio } from "../lib/formato";
import { linkPedido } from "../lib/whatsapp";

export default function PanelPedido() {
  const pedido = usePedido();
  const { items, abierto, cerrar, total } = pedido;
  const panelRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;
    const anterior = document.activeElement;
    panelRef.current?.focus();
    const alTeclear = (e) => e.key === "Escape" && cerrar();
    document.addEventListener("keydown", alTeclear);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.style.overflow = "";
      anterior?.focus?.();
    };
  }, [abierto, cerrar]);

  if (!abierto) return null;

  return (
    <div className="pedido-fondo" onClick={cerrar}>
      <aside
        className="pedido"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pedido-titulo"
        tabIndex={-1}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pedido-cabecera">
          <h2 id="pedido-titulo">Mi pedido</h2>
          <button type="button" className="boton-cerrar" onClick={cerrar} aria-label="Cerrar pedido">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="pedido-vacio">
            <p>Todavía no agregaste ninguna gorra.</p>
            <a href="/#coleccion" className="boton boton-secundario" onClick={cerrar}>
              Ver la colección
            </a>
          </div>
        ) : (
          <>
            <ul className="pedido-lista">
              {items.map((item) => (
                <li key={`${item.id}|${item.color}`} className="pedido-item">
                  <div className="pedido-item-foto">{item.foto && <img src={item.foto} alt="" />}</div>
                  <div className="pedido-item-datos">
                    <p className="pedido-item-nombre">{item.nombre}</p>
                    {item.color && <p className="pedido-item-color">{item.color}</p>}
                    <div className="cantidad" aria-label="Cantidad">
                      <button
                        type="button"
                        onClick={() => pedido.cambiarCantidad(item.id, item.color, item.cantidad - 1)}
                        aria-label="Restar una"
                      >
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        type="button"
                        onClick={() => pedido.cambiarCantidad(item.id, item.color, item.cantidad + 1)}
                        disabled={item.maximo != null && item.cantidad >= item.maximo}
                        aria-label="Sumar una"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="pedido-item-derecha">
                    <p>{precio(item.precio * item.cantidad)}</p>
                    <button type="button" className="boton-texto" onClick={() => pedido.quitar(item.id, item.color)}>
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pedido-pie">
              <p className="pedido-total">
                <span>Total</span>
                <span>{precio(total)}</span>
              </p>
              <a className="boton boton-primario boton-ancho" href={linkPedido(items)} target="_blank" rel="noreferrer">
                Enviar pedido por WhatsApp
              </a>
              <p className="pedido-nota">Te respondo por WhatsApp para coordinar el pago y el envío.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
