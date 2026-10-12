// Lugar reservado para un modelo que todavía no está cargado: una gorra "a medio bordar".
export default function TarjetaProximamente() {
  return (
    <article className="tarjeta tarjeta-proxima" aria-label="Próximo modelo">
      <div className="tarjeta-foto tarjeta-foto-proxima">
        <svg viewBox="0 0 200 140" aria-hidden="true" className="gorra-puntada">
          <path d="M28 104 C28 52 62 26 100 26 C138 26 160 56 162 104 Z" />
          <path d="M150 104 C178 102 196 108 196 116 C176 120 150 116 138 110" />
          <path d="M100 26 C92 50 90 78 92 104" />
          <circle cx="100" cy="26" r="5" />
        </svg>
      </div>
      <h3 className="tarjeta-nombre">Próximamente</h3>
      <p className="tarjeta-nota">Este modelo todavía está en el bastidor.</p>
    </article>
  );
}
