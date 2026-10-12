import { createContext, useContext, useEffect, useMemo, useState } from "react";

const PedidoContext = createContext(null);
const CLAVE = "ladob-pedido";

function leerGuardado() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
  } catch {
    return [];
  }
}

export function PedidoProvider({ children }) {
  const [items, setItems] = useState(leerGuardado);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      // Sin almacenamiento disponible: el pedido vive solo en esta visita.
    }
  }, [items]);

  const valor = useMemo(() => {
    const clave = (id, color) => `${id}|${color || ""}`;

    return {
      items,
      abierto,
      abrir: () => setAbierto(true),
      cerrar: () => setAbierto(false),
      cantidadTotal: items.reduce((suma, item) => suma + item.cantidad, 0),
      total: items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),

      agregar(producto, color, cantidad, maximo) {
        setItems((actuales) => {
          const k = clave(producto.id, color);
          const existente = actuales.find((item) => clave(item.id, item.color) === k);
          if (existente) {
            return actuales.map((item) =>
              clave(item.id, item.color) === k
                ? { ...item, cantidad: Math.min(item.cantidad + cantidad, maximo ?? Infinity) }
                : item
            );
          }
          return [
            ...actuales,
            {
              id: producto.id,
              nombre: producto.nombre,
              precio: producto.precio,
              foto: producto.fotos?.[0] || null,
              color,
              cantidad,
              maximo,
            },
          ];
        });
      },

      cambiarCantidad(id, color, cantidad) {
        setItems((actuales) =>
          actuales
            .map((item) =>
              clave(item.id, item.color) === clave(id, color)
                ? { ...item, cantidad: Math.min(cantidad, item.maximo ?? Infinity) }
                : item
            )
            .filter((item) => item.cantidad > 0)
        );
      },

      quitar(id, color) {
        setItems((actuales) => actuales.filter((item) => clave(item.id, item.color) !== clave(id, color)));
      },

      vaciar: () => setItems([]),
    };
  }, [items, abierto]);

  return <PedidoContext.Provider value={valor}>{children}</PedidoContext.Provider>;
}

export const usePedido = () => useContext(PedidoContext);
