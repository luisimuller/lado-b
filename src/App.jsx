import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Encabezado from "./components/Encabezado";
import PieDePagina from "./components/PieDePagina";
import PanelPedido from "./components/PanelPedido";
import Inicio from "./pages/Inicio";
import PaginaProducto from "./pages/PaginaProducto";
import NoEncontrada from "./pages/NoEncontrada";
import Panel from "./pages/admin/Panel";
import FormularioProducto from "./pages/admin/FormularioProducto";

function ScrollAlCambiar() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const enPanel = pathname.startsWith("/admin");

  return (
    <>
      <ScrollAlCambiar />
      <a className="saltar" href="#contenido">
        Ir al contenido
      </a>
      <Encabezado enPanel={enPanel} />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/gorra/:id" element={<PaginaProducto />} />
          <Route path="/admin" element={<Panel />} />
          <Route path="/admin/nueva" element={<FormularioProducto />} />
          <Route path="/admin/editar/:id" element={<FormularioProducto />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      {!enPanel && <PieDePagina />}
      {!enPanel && <PanelPedido />}
    </>
  );
}
