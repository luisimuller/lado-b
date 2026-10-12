const pesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export const precio = (valor) => pesos.format(valor || 0);

export const stockTotal = (producto) =>
  (producto.colores || []).reduce((total, color) => total + (Number(color.stock) || 0), 0);

export const estaAgotado = (producto) => (producto.colores || []).length > 0 && stockTotal(producto) === 0;
