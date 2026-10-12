import { Link } from "react-router-dom";

export default function NoEncontrada() {
  return (
    <section className="seccion vacio">
      <h1>Esta página no existe</h1>
      <p>Puede que el link esté mal escrito.</p>
      <Link to="/" className="boton boton-secundario">
        Ir al inicio
      </Link>
    </section>
  );
}
