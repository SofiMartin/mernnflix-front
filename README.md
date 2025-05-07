# 🌟 ANIMEVERSE

<div align="center">
  <img src="https://via.placeholder.com/200x200?text=ANIMEVERSE" alt="Animeverse Logo" width="200"/>
  <p><em>Tu plataforma definitiva para descubrir, coleccionar y compartir tus animes favoritos.</em></p>
</div>

## 📋 Índice

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [API](#-api)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## 🚀 Descripción

Animeverse es una aplicación web moderna para los amantes del anime que permite a los usuarios explorar, catalogar y mantener un seguimiento de sus animes favoritos. La plataforma cuenta con un diseño atractivo y adaptable, sistema de perfiles con control parental, y una experiencia de usuario personalizada.

## ✨ Características

- **Catálogo completo de animes** con información detallada, incluyendo sinopsis, géneros, estudios, y más
- **Sistema de perfiles** para diferentes usuarios con control parental según la edad
- **Watchlist personalizada** para seguir tu progreso en cada serie
- **Clasificación por estados** (Viendo, Completado, Por ver, Abandonado)
- **Sistema de favoritos** para marcar tus animes preferidos
- **Filtrado y búsqueda avanzada** por géneros, estado y otros criterios
- **Panel de administración** para gestionar el contenido (solo para administradores)
- **Diseño responsive** que se adapta a dispositivos móviles y de escritorio
- **Modo oscuro/claro** integrado

## 🛠 Tecnologías

- **React** - Biblioteca JavaScript para la interfaz de usuario
- **React Router** - Navegación y enrutamiento
- **Context API** - Gestión de estado global
- **Tailwind CSS** - Framework CSS para diseño adaptable y moderno
- **Axios** - Cliente HTTP para comunicación con la API
- **React Hook Form + Yup** - Validación y gestión de formularios
- **React Toastify** - Notificaciones elegantes
- **SweetAlert2** - Alertas personalizadas
- **JWT** - Autenticación basada en tokens

## 📂 Estructura del Proyecto

```
src/
├── components/         # Componentes reutilizables
├── context/            # Contextos para gestión de estado
├── pages/              # Componentes de página
├── router/             # Configuración de rutas
├── services/           # Servicios para API
├── App.jsx             # Componente principal
├── main.jsx            # Punto de entrada
└── index.css           # Estilos globales
```

### Componentes Principales

- **AnimeCard**: Muestra la información de un anime en formato de tarjeta
- **Navbar**: Barra de navegación con menú adaptable
- **Footer**: Pie de página con información del sitio
- **WatchlistButton**: Botón para añadir/quitar animes de la watchlist
- **Pagination**: Componente de paginación para listas
- **ThemeToggle**: Selector de tema claro/oscuro

### Contextos

- **AuthContext**: Gestión de autenticación y usuario
- **ProfileContext**: Perfiles de usuario y selección
- **AnimeContext**: Operaciones relacionadas con animes
- **WatchlistContext**: Gestión de la lista de seguimiento
- **ThemeContext**: Configuración de tema claro/oscuro

## 💻 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/animeverse.git
   cd animeverse
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz con la siguiente variable:
   ```
   VITE_API_URL=http://localhost:8800/api
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🔍 Uso

### Registro y Perfiles

1. Regístrate con tu correo y contraseña
2. Crea diferentes perfiles según las edades (niños, adolescentes, adultos)
3. Selecciona un perfil para comenzar

### Explorando Animes

1. Navega por el catálogo completo en la sección "Explorar"
2. Utiliza los filtros para encontrar animes por género, estado o año
3. Busca animes específicos con la barra de búsqueda

### Gestionando tu Lista

1. Añade animes a tu watchlist con el botón correspondiente
2. Clasifica tus animes como "Viendo", "Completado", "Por ver" o "Abandonado"
3. Marca tus favoritos para acceder rápidamente

### Administración (solo admin)

1. Añade nuevos animes manualmente o mediante importación
2. Edita la información de animes existentes
3. Elimina animes del catálogo

## 📸 Capturas de Pantalla

<div align="center">
  <img src="https://via.placeholder.com/800x450?text=Home+Page" alt="Home Page" width="80%"/>
  <p><em>Página principal</em></p>
  
  <img src="https://via.placeholder.com/800x450?text=Anime+Explorer" alt="Anime Explorer" width="80%"/>
  <p><em>Explorador de animes</em></p>
  
  <img src="https://via.placeholder.com/800x450?text=Watchlist" alt="Watchlist" width="80%"/>
  <p><em>Lista de seguimiento personalizada</em></p>
</div>

## 🔌 API

El frontend se comunica con una API REST mediante los siguientes endpoints principales:

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh` - Refrescar token

### Perfiles
- `GET /profiles` - Obtener perfiles del usuario
- `POST /profiles` - Crear nuevo perfil
- `PUT /profiles/:id` - Actualizar perfil
- `DELETE /profiles/:id` - Eliminar perfil

### Animes
- `GET /animes` - Listar animes con filtros
- `GET /animes/:id` - Obtener detalles de un anime
- `POST /animes` - Crear nuevo anime (admin)
- `PUT /animes/:id` - Actualizar anime (admin)
- `DELETE /animes/:id` - Eliminar anime (admin)

### Watchlist
- `GET /watchlists/:profileId` - Obtener watchlist
- `POST /watchlists` - Añadir anime a watchlist
- `PUT /watchlists/:id` - Actualizar entrada de watchlist
- `DELETE /watchlists/:id` - Eliminar entrada de watchlist

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">
  <p>Desarrollado con ❤️ por Sofi Martin</p>
</div>
