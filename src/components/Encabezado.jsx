import { Link } from "react-router-dom";
import { usePedido } from "../context/PedidoContext";
import { useSesion } from "../lib/useSesion";
import { LogoNombre } from "./Logo";

export default function Encabezado({ enPanel }) {
  const { cantidadTotal, abrir } = usePedido();
  const sesion = useSesion();

  return (
    <header className="encabezado">
      <div className="encabezado-interior">
        <Link to="/" className="encabezado-logo">
          <LogoNombre />
        </Link>

        {enPanel ? (
          <nav className="encabezado-nav" aria-label="Panel">
            <Link to="/admin">Productos</Link>
            <Link to="/">Ver la tienda</Link>
          </nav>
        ) : (
          <nav className="encabezado-nav" aria-label="Principal">
            <a href="/#coleccion">Colección</a>
            <a href="/#sobre">Sobre Lado B</a>
            {sesion && <Link to="/admin">Mi panel</Link>}
            <button type="button" className="boton-pedido" onClick={abrir}>
              Mi pedido
              {cantidadTotal > 0 && (
                <span className="boton-pedido-cantidad" aria-label={`${cantidadTotal} gorras`}>
                  {cantidadTotal}
                </span>
              )}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}