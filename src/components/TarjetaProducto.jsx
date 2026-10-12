import { Link } from "react-router-dom";
import { estaAgotado, precio } from "../lib/formato";
import Muestras from "./Muestras";

export default function TarjetaProducto({ producto }) {
  const agotado = estaAgotado(producto);
  const foto = producto.fotos?.[0];

  return (
    <article className="tarjeta">
      <Link to={`/gorra/${producto.id}`} className="tarjeta-link">
        <div className="tarjeta-foto">
          {foto ? (
            <img src={foto} alt={producto.nombre} loading="lazy" />
          ) : (
            <span className="tarjeta-sin-foto">Foto en camino</span>
          )}
          {agotado && <span className="etiqueta-agotado">Agotada</span>}
        </div>
        <h3 className="tarjeta-nombre">{producto.nombre}</h3>
      </Link>
      <div className="tarjeta-pie">
        <span className="tarjeta-precio">{precio(producto.precio)}</span>
        <Muestras colores={producto.colores} />
      </div>
    </article>
  );
}
