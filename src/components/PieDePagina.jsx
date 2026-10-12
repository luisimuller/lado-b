import { linkConsulta } from "../lib/whatsapp";

const INSTAGRAM = import.meta.env.VITE_INSTAGRAM;

export default function PieDePagina() {
  return (
    <footer className="pie">
      <div className="pie-interior">
        <p className="pie-slogan">bordando ideas</p>
        <ul className="pie-links">
          <li>
            <a href={linkConsulta()} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </li>
          {INSTAGRAM && (
            <li>
              <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          )}
        </ul>
        <p className="pie-legal">© {new Date().getFullYear()} Lado B</p>
      </div>
    </footer>
  );
}
