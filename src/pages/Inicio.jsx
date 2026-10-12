import { useEffect, useMemo, useState } from "react";
import { LogoCompleto } from "../components/Logo";
import TarjetaProducto from "../components/TarjetaProducto";
import TarjetaProximamente from "../components/TarjetaProximamente";
import { listarPublicados } from "../lib/productos";

// Mínimo de lugares en la grilla: si hay menos modelos, se completan con "Próximamente".
const LUGARES_MINIMOS = 3;

export default function Inicio() {
  const [productos, setProductos] = useState(null);
  const [error, setError] = useState(false);
  const [coleccion, setColeccion] = useState("todas");

  useEffect(() => {
    listarPublicados()
      .then(setProductos)
      .catch(() => {
        setError(true);
        setProductos([]);
      });
  }, []);

  const colecciones = useMemo(
    () => [...new Set((productos || []).map((p) => p.coleccion).filter(Boolean))],
    [productos]
  );

  const visibles = (productos || []).filter((p) => coleccion === "todas" || p.coleccion === coleccion);
  const huecos = coleccion === "todas" ? Math.max(0, LUGARES_MINIMOS - visibles.length) : 0;

  return (
    <>
      <section className="portada">
        <LogoCompleto animado className="portada-logo" />
        <p className="portada-texto">Gorras bordadas a mano, con diseños propios y de a pocas unidades.</p>
        <a href="#coleccion" className="boton boton-primario">
          Ver la colección
        </a>
      </section>

      <section id="coleccion" className="seccion coleccion" aria-labelledby="coleccion-titulo">
        <div className="coleccion-cabecera">
          <h2 id="coleccion-titulo">La colección</h2>
          {colecciones.length > 1 && (
            <div className="filtros" role="group" aria-label="Filtrar por colección">
              {["todas", ...colecciones].map((c) => (
                <button
                  key={c}
                  type="button"
                  className="filtro"
                  aria-pressed={coleccion === c}
                  onClick={() => setColeccion(c)}
                >
                  {c === "todas" ? "Todas" : c}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="aviso">No se pudo cargar la colección. Revisá tu conexión y volvé a cargar la página.</p>
        )}

        {productos === null ? (
          <p className="cargando">Cargando gorras…</p>
        ) : (
          <div className="grilla">
            {visibles.map((producto) => (
              <TarjetaProducto key={producto.id} producto={producto} />
            ))}
            {Array.from({ length: huecos }, (_, i) => (
              <TarjetaProximamente key={`proxima-${i}`} />
            ))}
          </div>
        )}
      </section>

      <section id="sobre" className="seccion sobre" aria-labelledby="sobre-titulo">
        <div className="sobre-interior">
          <h2 id="sobre-titulo">Hola, soy Lu</h2>
          <div className="sobre-texto">
            <p>
              Mi vida suele transcurrir bastante lejos de la aguja y el hilo, pero siempre me gustó aprender
              cosas nuevas. Así nació Lado B.
            </p>
            <p>Primero fue curiosidad. Después, un hobby. Y un día se me ocurrió hacer algo con eso.</p>
            <p>
              Todavía no sé hasta dónde va a llegar este proyecto, y un poco me gusta que sea así. La idea es
              disfrutar el proceso, probar diseños y bordar gorras con onda, de esas que yo misma elegiría usar.
            </p>
            <p className="sobre-firma">Bienvenidos a mi lado B.</p>
          </div>
        </div>
      </section>
    </>
  );
}