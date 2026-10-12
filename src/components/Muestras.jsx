// Puntitos con los colores disponibles de una gorra.
export default function Muestras({ colores = [] }) {
  if (!colores.length) return null;
  return (
    <ul className="muestras" aria-label={`Colores: ${colores.map((c) => c.nombre).join(", ")}`}>
      {colores.map((color) => (
        <li
          key={color.nombre}
          className="muestra"
          style={{ background: color.hex }}
          title={color.nombre}
        />
      ))}
    </ul>
  );
}
