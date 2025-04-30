import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimeContext } from '../context/AnimeContext';
import { toast } from 'react-toastify';

const AnimeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAnimeById, updateAnime } = useContext(AnimeContext);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    synopsis: '',
    genres: [],
    rating: 0,
    seasonCount: 1,
    episodeCount: 1,
    status: 'En emisión',
    releaseYear: new Date().getFullYear(),
    studio: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Géneros disponibles
  const genreOptions = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery',
    'Psychological', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports',
    'Supernatural', 'Thriller', 'Mecha', 'Music', 'School', 'Historical'
  ].sort();
  
  // Cargar datos del anime
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const data = await getAnimeById(id);
        if (data) {
          setFormData(data);
        } else {
          toast.error('El anime no existe');
          navigate('/animes');
        }
      } catch (error) {
        console.error('Error al cargar el anime:', error);
        toast.error('Error al cargar los datos del anime');
        navigate('/animes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnime();
  }, [id, getAnimeById, navigate]);
  
  // Manejadores de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleGenreChange = (e) => {
    const genre = e.target.value;
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, genre]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        genres: prev.genres.filter(g => g !== genre)
      }));
    }
    
    // Limpiar error
    if (errors.genres) {
      setErrors(prev => ({
        ...prev,
        genres: null
      }));
    }
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'La URL de la imagen es obligatoria';
    } else if (!/^https?:\/\/.+\..+/.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Debe ser una URL válida (http:// o https://)';
    }
    
    if (!formData.synopsis.trim()) {
      newErrors.synopsis = 'La sinopsis es obligatoria';
    } else if (formData.synopsis.length < 20) {
      newErrors.synopsis = 'La sinopsis debe tener al menos 20 caracteres';
    }
    
    if (formData.genres.length === 0) {
      newErrors.genres = 'Selecciona al menos un género';
    }
    
    if (formData.rating < 0 || formData.rating > 10) {
      newErrors.rating = 'La puntuación debe estar entre 0 y 10';
    }
    
    if (formData.seasonCount < 1) {
      newErrors.seasonCount = 'Debe tener al menos 1 temporada';
    }
    
    if (formData.episodeCount < 1) {
      newErrors.episodeCount = 'Debe tener al menos 1 episodio';
    }
    
    if (!formData.releaseYear || formData.releaseYear < 1950 || formData.releaseYear > new Date().getFullYear() + 1) {
      newErrors.releaseYear = `El año debe estar entre 1950 y ${new Date().getFullYear() + 1}`;
    }
    
    if (!formData.studio.trim()) {
      newErrors.studio = 'El estudio es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores del formulario');
      // Scroll al primer error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setSubmitting(true);
    
    try {
      const result = await updateAnime(id, formData);
      if (result) {
        toast.success('¡Anime actualizado con éxito!');
        navigate(`/animes/${id}`);
      }
    } catch (error) {
      console.error('Error al actualizar anime:', error);
      toast.error('Ocurrió un error al actualizar el anime');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Mostrar spinner mientras se cargan los datos
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 border border-gray-700">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-1 h-8 rounded-full mr-3"></span>
            Editar: {formData.title}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium" htmlFor="title">
                Título <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-700 border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                placeholder="Nombre del anime"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>
            
            {/* URL de la imagen */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium" htmlFor="imageUrl">
                URL de la imagen <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-700 border ${errors.imageUrl ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.imageUrl && <p className="text-red-400 text-sm mt-1">{errors.imageUrl}</p>}
              
              {/* Vista previa de la imagen */}
              {formData.imageUrl && (
                <div className="mt-2 flex justify-center">
                  <div className="relative w-32 h-48 rounded overflow-hidden border border-gray-600">
                    <img 
                      src={formData.imageUrl} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover"
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x450?text=URL+inválida';
                        setImageLoaded(true);
                      }}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Géneros */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Géneros <span className="text-red-400">*</span>
              </label>
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {genreOptions.map(genre => (
                    <div key={genre} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`genre-${genre}`}
                        value={genre}
                        checked={formData.genres.includes(genre)}
                        onChange={handleGenreChange}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <label htmlFor={`genre-${genre}`} className="ml-2 text-gray-300">
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {errors.genres && <p className="text-red-400 text-sm mt-1">{errors.genres}</p>}
              
              {/* Chips de géneros seleccionados */}
              {formData.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.genres.map(genre => (
                    <span 
                      key={genre}
                      className="px-3 py-1 bg-purple-900/60 text-purple-200 rounded-full text-sm flex items-center"
                    >
                      {genre}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            genres: prev.genres.filter(g => g !== genre)
                          }));
                        }}
                        className="ml-2 text-purple-300 hover:text-white"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Sinopsis */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium" htmlFor="synopsis">
                Sinopsis <span className="text-red-400">*</span>
              </label>
              <textarea
                id="synopsis"
                name="synopsis"
                value={formData.synopsis}
                onChange={handleChange}
                rows="5"
                className={`w-full p-3 bg-gray-700 border ${errors.synopsis ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none`}
                placeholder="Describe la historia del anime..."
              ></textarea>
              <div className="flex justify-between mt-1">
                {errors.synopsis ? (
                  <p className="text-red-400 text-sm">{errors.synopsis}</p>
                ) : (
                  <p className="text-gray-400 text-xs">Mínimo 20 caracteres</p>
                )}
                <p className="text-gray-400 text-xs">{formData.synopsis.length} caracteres</p>
              </div>
            </div>
            
            {/* Fila con 4 campos numéricos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Rating */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium" htmlFor="rating">
                  Puntuación <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleNumberChange}
                    className={`w-full p-3 bg-gray-700 border ${errors.rating ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-12`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-400">/10</span>
                  </div>
                </div>
                {errors.rating && <p className="text-red-400 text-sm mt-1">{errors.rating}</p>}
              </div>
              
              {/* Año de lanzamiento */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium" htmlFor="releaseYear">
                  Año <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="releaseYear"
                  name="releaseYear"
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  value={formData.releaseYear}
                  onChange={handleNumberChange}
                  className={`w-full p-3 bg-gray-700 border ${errors.releaseYear ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                />
                {errors.releaseYear && <p className="text-red-400 text-sm mt-1">{errors.releaseYear}</p>}
              </div>
              
              {/* Temporadas */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium" htmlFor="seasonCount">
                  Temporadas <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="seasonCount"
                  name="seasonCount"
                  min="1"
                  value={formData.seasonCount}
                  onChange={handleNumberChange}
                  className={`w-full p-3 bg-gray-700 border ${errors.seasonCount ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                />
                {errors.seasonCount && <p className="text-red-400 text-sm mt-1">{errors.seasonCount}</p>}
              </div>
              
              {/* Episodios */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium" htmlFor="episodeCount">
                  Episodios <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  id="episodeCount"
                  name="episodeCount"
                  min="1"
                  value={formData.episodeCount}
                  onChange={handleNumberChange}
                  className={`w-full p-3 bg-gray-700 border ${errors.episodeCount ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                />
                {errors.episodeCount && <p className="text-red-400 text-sm mt-1">{errors.episodeCount}</p>}
              </div>
            </div>
            
            {/* Fila con estudio y estado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Estudio */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium" htmlFor="studio">
                  Estudio <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="studio"
                  name="studio"
                  value={formData.studio}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-700 border ${errors.studio ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                  placeholder="Nombre del estudio"
                />
                {errors.studio && <p className="text-red-400 text-sm mt-1">{errors.studio}</p>}
              </div>
              
              {/* Estado */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium" htmlFor="status">
                  Estado <span className="text-red-400">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors appearance-none"
                  style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" width=\"24\" height=\"24\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat" }}
                >
                  <option value="En emisión">En emisión</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Anunciado">Anunciado</option>
                  <option value="Pausado">Pausado</option>
                </select>
              </div>
            </div>
            
            {/* Botones */}
            <div className="flex justify-between pt-6 border-t border-gray-700">
              <Link 
                to={`/animes/${id}`} 
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Cancelar
              </Link>
              <button 
                type="submit" 
                className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                  submitting 
                    ? 'bg-purple-800 text-purple-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:-translate-y-1'
                } transition-all duration-300`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Actualizar Anime
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnimeEdit;