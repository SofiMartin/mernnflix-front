# 🌟 AnimeVerse - Gestor de Animes

![AnimeVerse](https://github.com/user-attachments/assets/df54c461-a9c5-4966-b851-828297d34bc6)

## 📋 Descripción

AnimeVerse es una aplicación web moderna desarrollada con React, Vite y TailwindCSS que permite gestionar una colección de animes. La aplicación implementa operaciones CRUD completas (Crear, Leer, Actualizar, Eliminar) y ofrece una interfaz de usuario elegante y responsive.

## ✨ Características

- **Catálogo Completo:** Explora una amplia colección de animes con información detallada
- **Filtros y Búsqueda:** Encuentra rápidamente animes por título, género o estado
- **Gestión Total:** Agrega, edita y elimina animes de la colección
- **Diseño Responsivo:** Experiencia fluida en dispositivos móviles, tablets y desktops
- **Interfaz Moderna:** Tema oscuro con acentos en púrpura y rosa, animaciones sutiles y microinteracciones
- **Validación de Formularios:** Formularios con validación completa para garantizar la integridad de los datos
- **Notificaciones:** Feedback visual para todas las operaciones mediante toast notifications

## 🛠️ Tecnologías Utilizadas

- **React** - Biblioteca para construir interfaces de usuario
- **Vite** - Herramienta de construcción frontend rápida
- **React Router DOM** - Navegación y enrutamiento
- **TailwindCSS** - Framework CSS para diseño rápido y responsivo
- **Context API** - Manejo de estado global
- **Axios** - Cliente HTTP para peticiones a la API
- **React Toastify** - Sistema de notificaciones
- **SweetAlert2** - Diálogos de confirmación interactivos

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (v14.0.0 o superior)
- npm o yarn

### Pasos para Instalar

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/anime-manager.git
cd anime-manager
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura la API:
   - Abre `src/context/AnimeContext.jsx`
   - Actualiza la variable `API_URL` con la URL de tu API

4. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

5. Abre tu navegador en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
/src
 ├── components         # Componentes reutilizables
 │   ├── AnimeCard.jsx  # Tarjeta de anime individual
 │   └── Navbar.jsx     # Barra de navegación
 ├── pages              # Páginas principales
 │   ├── Home.jsx       # Página de inicio
 │   ├── AnimeList.jsx  # Listado de animes
 │   ├── AnimeDetail.jsx # Detalle de anime
 │   ├── AnimeCreate.jsx # Formulario para crear
 │   ├── AnimeEdit.jsx  # Formulario para editar
 │   └── NotFound.jsx   # Página 404
 ├── context
 │   └── AnimeContext.jsx # Estado global y lógica CRUD
 ├── Router
 │   └── AppRouter.jsx  # Configuración de rutas
 ├── App.jsx            # Componente principal
 └── main.jsx           # Punto de entrada
```

## 🔍 API y Endpoints

La aplicación utiliza MockAPI para el backend. Los endpoints disponibles son:

- `GET /animes` - Obtener todos los animes
- `GET /animes/:id` - Obtener un anime específico
- `POST /animes` - Crear un nuevo anime
- `PUT /animes/:id` - Actualizar un anime existente
- `DELETE /animes/:id` - Eliminar un anime

## 📱 Capturas de Pantalla

### Página Principal
![Página Principal](https://github.com/user-attachments/assets/8131a407-4bbe-404f-8669-0be0187027eb)

### Detalle de Anime
![Detalle](https://github.com/user-attachments/assets/b525796d-f168-4f8a-8df0-2a77410b96f7)

### Formulario
![Formulario](https://github.com/user-attachments/assets/48432508-2f86-44e6-a1e6-9ec128388f5b)

## Listado
![Listado](https://github.com/user-attachments/assets/b77857eb-7c12-4785-a3da-38c050ab4e4c)


## 🌐 Demo en Vivo

Puedes ver una demo de la aplicación en:
[https://animeverse-demo.netlify.app](https://animemanger.netlify.app/)

## 👥 Autor

- **Hecho con amor por Sofi <3** - [GitHub](https://github.com/sofimartin)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado como parte del trabajo práctico para el Sprint 5.
