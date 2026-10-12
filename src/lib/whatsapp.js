import { precio } from "./formato";

const NUMERO = import.meta.env.VITE_WHATSAPP_NUMERO || "";

export function linkPedido(items) {
  const lineas = items.map(
    (item) =>
      `• ${item.nombre}${item.color ? ` (${item.color})` : ""} x${item.cantidad}: ${precio(item.precio * item.cantidad)}`
  );
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const mensaje = [
    "¡Hola! Quiero hacer este pedido en Lado B:",
    "",
    ...lineas,
    "",
    `Total: ${precio(total)}`,
  ].join("\n");
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje)}`;
}

export function linkConsulta() {
  const mensaje = "¡Hola! Tengo una consulta sobre las gorras de Lado B.";
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
