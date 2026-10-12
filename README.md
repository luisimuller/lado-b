# Lado B · bordando ideas

Tienda online de gorras bordadas a mano. Los visitantes arman su pedido y lo envían por WhatsApp; los modelos se cargan desde un panel de administración privado.

**Tecnologías:** React 18 + Vite, React Router, Supabase (base de datos PostgreSQL, autenticación y almacenamiento de fotos), deploy en Vercel.

## Funcionalidades

- Portada con el logo animado (el hilo se "borda" al cargar la página).
- Colección con filtro por colección y lugares de "Próximamente" cuando hay pocos modelos cargados.
- Página de cada gorra con galería de fotos, selector de color con stock y cantidad.
- Pedido guardado en el navegador, que se envía por WhatsApp con el detalle y el total armados.
- Panel de administración con login para cargar, editar, ocultar y borrar gorras, subir fotos, elegir la portada y manejar stock por color.
- Seguridad con Row Level Security: los visitantes solo pueden leer productos publicados; solo la administradora puede escribir.
- Accesible desde teclado, responsive y respetando la preferencia de movimiento reducido.

## Puesta en marcha

1. **Crear el proyecto en Supabase** (supabase.com, plan gratuito). Ir a SQL Editor, pegar el contenido de `supabase/esquema.sql` y ejecutarlo. Eso crea la tabla de productos, los permisos y la carpeta de fotos.
2. **Crear tu usuaria de administradora**: en Authentication > Users > Add user, cargar tu email y una contraseña (marcá "Auto Confirm User").
3. **Cerrar el registro público**: en Authentication > Sign In / Providers, desactivar "Allow new users to sign up". Así nadie más puede crearse una cuenta y entrar al panel.
4. **Configurar las variables**: copiar `.env.example` como `.env` y completar la URL y la clave anon (Project Settings > API), tu número de WhatsApp y tu usuario de Instagram.
5. **Probar en tu compu**: `npm install` y después `npm run dev`. La tienda queda en http://localhost:5173 y el panel en http://localhost:5173/admin.
6. **Publicar**: subir el proyecto a GitHub, importarlo en Vercel y cargar las mismas variables del `.env` en Settings > Environment Variables. El archivo `vercel.json` ya está listo para que funcionen las rutas.

## Estructura

```
src/
  components/    Encabezado, logo, tarjetas, panel del pedido, pie
  context/       Estado del pedido (carrito)
  lib/           Conexión a Supabase, consultas, formato de precios, WhatsApp
  pages/         Inicio, página de producto, 404
  pages/admin/   Ingreso, listado y formulario de productos
supabase/
  esquema.sql    Tablas, permisos y almacenamiento
```
