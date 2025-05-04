import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AnimeContext } from "../context/AnimeContext";
import { AuthContext } from "../context/authContext";
import AnimeCard from "../components/AnimeCard";

const AnimeList = () => {
  const {
    animes,
    loading,
    error,
    fetchAnimes,
    totalAnimes,
    currentPage,
    totalPages,
  } = useContext(AnimeContext);
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const [filteredAnimes, setFilteredAnimes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentView, setCurrentView] = useState("grid"); // 'grid' o 'list'
  const [sortBy, setSortBy] = useState("rating"); // 'rating', 'title', 'year'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' o 'desc'

  // Lista única de géneros a partir de todos los animes
  const allGenres = [
    ...new Set(animes.flatMap((anime) => anime.genres)),
  ].sort();

  // Cargar animes cuando se monta el componente
  useEffect(() => {
    // Llamamos directamente a fetchAnimes para cargar los animes
    console.log("Montando componente AnimeList, llamando a fetchAnimes");
    fetchAnimes({
      sort: sortBy,
      order: sortOrder,
      genre: selectedGenre,
      status: selectedStatus,
      search: searchTerm,
    });
  }, [fetchAnimes]); // Solo al montar

  // Aplicar filtros y ordenamiento cuando cambian las opciones de filtrado
  useEffect(() => {
    console.log("Aplicando filtros con opciones:", {
      sortBy,
      sortOrder,
      selectedGenre,
      selectedStatus,
      searchTerm,
    });
    fetchAnimes({
      sort: sortBy,
      order: sortOrder,
      genre: selectedGenre,
      status: selectedStatus,
      search: searchTerm,
    });
  }, [
    sortBy,
    sortOrder,
    selectedGenre,
    selectedStatus,
    searchTerm,
    fetchAnimes,
  ]);

  // Actualizar filteredAnimes cuando cambian los animes
  useEffect(() => {
    setFilteredAnimes(animes);
    console.log("Animes actualizados:", animes);
  }, [animes]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSelectedStatus("");
    setSortBy("rating");
    setSortOrder("desc");
  };

  // Componente para estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-300 text-lg">Cargando animes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Componente para estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 px-4">
        <div className="container mx-auto">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-xl mx-auto">
            <div className="flex items-center mb-4">
              <svg
                className="w-8 h-8 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h2 className="text-xl font-bold text-white">Error</h2>
            </div>
            <p className="text-red-200 mb-4">{error}</p>
            <div className="flex gap-4">
              <button
                onClick={() => fetchAnimes()}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Reintentar
              </button>
              <Link
                to="/"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header con título y botón para agregar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Explorar Animes
            </span>
          </h1>
          {/* Mostrar el botón solo si el usuario es administrador */}
          {isAuthenticated && currentUser && currentUser.isAdmin && (
            <Link
              to="/animes/create"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Agregar Anime
            </Link>
          )}
        </div>

        {/* Barra de filtros */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Búsqueda por texto */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por título o descripción..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Filtro por género */}
            <div>
              <select
                value={selectedGenre}
                onChange={handleGenreChange}
                className="w-full py-2 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                style={{
                  backgroundImage:
                    'url(\'data:image/svg+xml;utf8,<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7 10l5 5 5-5z"/></svg>\')',
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value="">Todos los géneros</option>
                {allGenres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full py-2 px-4 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                style={{
                  backgroundImage:
                    'url(\'data:image/svg+xml;utf8,<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7 10l5 5 5-5z"/></svg>\')',
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value="">Todos los estados</option>
                <option value="En emisión">En emisión</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            {/* Ordenamiento */}
            <div className="flex">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full py-2 px-4 bg-gray-700 border border-gray-600 rounded-l-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                style={{
                  backgroundImage:
                    'url(\'data:image/svg+xml;utf8,<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M7 10l5 5 5-5z"/></svg>\')',
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value="rating">Calificación</option>
                <option value="title">Título</option>
                <option value="year">Año</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className="px-4 py-2 bg-purple-700 border border-purple-600 rounded-r-lg text-white transition-colors hover:bg-purple-600"
                aria-label={
                  sortOrder === "asc" ? "Orden ascendente" : "Orden descendente"
                }
              >
                {sortOrder === "asc" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Botones de vista y limpiar filtros */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView("grid")}
                className={`p-2 rounded-md ${
                  currentView === "grid"
                    ? "bg-purple-700 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                aria-label="Vista de cuadrícula"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  ></path>
                </svg>
              </button>
              <button
                onClick={() => setCurrentView("list")}
                className={`p-2 rounded-md ${
                  currentView === "list"
                    ? "bg-purple-700 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                aria-label="Vista de lista"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Resultados */}
        {filteredAnimes.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-10 text-center">
            <svg
              className="w-16 h-16 text-gray-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-400 mb-6">
              Intenta con diferentes criterios o limpia los filtros para ver
              todos los animes.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Reiniciar búsqueda
            </button>
          </div>
        ) : (
          <>
            {/* Contador de resultados */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-300">
                <span className="font-medium text-white">
                  {filteredAnimes.length}
                </span>{" "}
                {filteredAnimes.length === 1
                  ? "anime encontrado"
                  : "animes encontrados"}
                {totalAnimes > filteredAnimes.length &&
                  ` (mostrando ${filteredAnimes.length} de ${totalAnimes})`}
              </p>

              {/* Paginación si es necesario */}
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      fetchAnimes({
                        page: currentPage - 1,
                        sort: sortBy,
                        order: sortOrder,
                        genre: selectedGenre,
                        status: selectedStatus,
                        search: searchTerm,
                      })
                    }
                    disabled={currentPage <= 1}
                    className={`p-2 rounded-md ${
                      currentPage <= 1
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                  </button>
                  <span className="text-gray-300">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      fetchAnimes({
                        page: currentPage + 1,
                        sort: sortBy,
                        order: sortOrder,
                        genre: selectedGenre,
                        status: selectedStatus,
                        search: searchTerm,
                      })
                    }
                    disabled={currentPage >= totalPages}
                    className={`p-2 rounded-md ${
                      currentPage >= totalPages
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Lista de animes */}
            {currentView === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAnimes.map((anime) => (
                  <AnimeCard key={anime.id || anime._id} anime={anime} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnimes.map((anime) => (
                  <div
                    key={anime.id || anime._id}
                    className="flex bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
                  >
                    <div className="w-24 md:w-36 flex-shrink-0">
                      <img
                        src={anime.imageUrl}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300x450?text=No+disponible";
                        }}
                      />
                    </div>
                    <div className="flex-grow p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-white">
                          {anime.title}
                        </h3>
                        <div className="flex items-center bg-black/30 text-yellow-400 px-2 py-1 rounded text-sm">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          {anime.rating.toFixed(1)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 my-2">
                        {anime.genres &&
                          anime.genres.map((genre, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-900/40 text-purple-200 text-xs rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                        {anime.synopsis}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-gray-400">
                          <span
                            className={
                              anime.status === "Finalizado"
                                ? "text-blue-400"
                                : "text-green-400"
                            }
                          >
                            {anime.status}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{anime.releaseYear}</span>
                          <span className="mx-2">•</span>
                          <span>{anime.studio}</span>
                        </div>

                        {/* Controles */}
                        <div className="flex space-x-2">
                          <Link
                            to={`/animes/${anime.id || anime._id}`}
                            className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
                          >
                            Detalles
                          </Link>
                          {isAuthenticated &&
                            currentUser &&
                            currentUser.isAdmin && (
                              <Link
                                to={`/animes/${anime.id || anime._id}/edit`}
                                className="px-4 py-1 bg-purple-700 hover:bg-purple-600 text-white text-sm rounded transition-colors"
                              >
                                Editar
                              </Link>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación inferior si hay muchos resultados */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() =>
                      fetchAnimes({
                        page: 1,
                        sort: sortBy,
                        order: sortOrder,
                        genre: selectedGenre,
                        status: selectedStatus,
                        search: searchTerm,
                      })
                    }
                    disabled={currentPage <= 1}
                    className={`p-2 rounded-md ${
                      currentPage <= 1
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      ></path>
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      fetchAnimes({
                        page: currentPage - 1,
                        sort: sortBy,
                        order: sortOrder,
                        genre: selectedGenre,
                        status: selectedStatus,
                        search: searchTerm,
                      })
                    }
                    disabled={currentPage <= 1}
                    className={`p-2 rounded-md ${
                      currentPage <= 1
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                  </button>

                  {/* Páginas numéricas */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calcular qué páginas mostrar
                    let pageNum;
                    if (totalPages <= 5) {
                      // Si hay 5 o menos páginas, mostrar todas
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // Si estamos cerca del inicio
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Si estamos cerca del final
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Si estamos en el medio
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          fetchAnimes({
                            page: pageNum,
                            sort: sortBy,
                            order: sortOrder,
                            genre: selectedGenre,
                            status: selectedStatus,
                            search: searchTerm,
                          })
                        }
                        className={`w-10 h-10 rounded-md ${
                          currentPage === pageNum
                            ? "bg-purple-700 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      fetchAnimes({
                        page: currentPage + 1,
                        sort: sortBy,
                        order: sortOrder,
                        genre: selectedGenre,
                        status: selectedStatus,
                        search: searchTerm,
                      })
                    }
                    disabled={currentPage >= totalPages}
                    className={`p-2 rounded-md ${
                      currentPage >= totalPages
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      fetchAnimes({
                        page: totalPages,
                        sort: sortBy,
                        order: sortOrder,
                        genre: selectedGenre,
                        status: selectedStatus,
                        search: searchTerm,
                      })
                    }
                    disabled={currentPage >= totalPages}
                    className={`p-2 rounded-md ${
                      currentPage >= totalPages
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnimeList;
