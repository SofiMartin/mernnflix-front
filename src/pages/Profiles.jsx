import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ProfileContext } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';

const ProfileCard = ({ profile, onSelect, onEdit, onDelete }) => {
  const { isDarkMode } = useTheme();
  
  // Determinar color de borde según tipo de perfil
  const getBorderColor = () => {
    switch (profile.type) {
      case 'kid': return 'border-blue-500';
      case 'teen': return 'border-green-500';
      case 'adult': return 'border-purple-500';
      default: return 'border-purple-500';
    }
  };
  
  // Texto indicativo del tipo de perfil
  const getTypeText = () => {
    switch (profile.type) {
      case 'kid': return 'Niño';
      case 'teen': return 'Adolescente';
      case 'adult': return 'Adulto';
      default: return 'Adulto';
    }
  };
  
  return (
    <div className="relative group">
      <div 
        className={`w-32 md:w-40 aspect-square rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 group-hover:scale-105 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } flex flex-col border-2 ${getBorderColor()}`}
        onClick={onSelect}
      >
        <div className="flex-grow flex items-center justify-center">
          <img 
            src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
            alt={profile.name} 
            className="w-24 h-24 rounded-full"
          />
        </div>
        <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-2 text-center`}>
          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium truncate`}>{profile.name}</p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{getTypeText()}</p>
        </div>
      </div>
      
      {/* Botones de edición/eliminación */}
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex space-x-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(profile);
            }} 
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(profile);
            }} 
            className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para crear/editar perfil
const ProfileForm = ({ profile, onSubmit, onCancel }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    avatar: profile?.avatar || '',
    type: profile?.type || 'adult'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        } mb-1`}>
          Nombre del perfil
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className={`w-full p-3 ${
            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
          } border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          placeholder="Nombre del perfil"
        />
      </div>
      
      <div>
        <label htmlFor="avatar" className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        } mb-1`}>
          URL del avatar (opcional)
        </label>
        <input
          id="avatar"
          name="avatar"
          type="text"
          value={formData.avatar}
          onChange={handleChange}
          className={`w-full p-3 ${
            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
          } border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
          placeholder="https://ejemplo.com/avatar.png"
        />
      </div>
      
      <div>
        <label className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        } mb-1`}>
          Tipo de perfil
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div 
            className={`p-4 border rounded-lg text-center cursor-pointer transition-colors ${
              formData.type === 'adult' 
                ? isDarkMode ? 'bg-purple-900/50 border-purple-500' : 'bg-purple-100 border-purple-300'
                : isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'adult' }))}
          >
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>Adulto</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sin restricciones</div>
            <input
              type="radio"
              name="type"
              value="adult"
              checked={formData.type === 'adult'}
              onChange={handleChange}
              className="sr-only"
            />
          </div>
          
          <div 
            className={`p-4 border rounded-lg text-center cursor-pointer transition-colors ${
              formData.type === 'teen' 
                ? isDarkMode ? 'bg-green-900/50 border-green-500' : 'bg-green-100 border-green-300'
                : isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'teen' }))}
          >
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>Adolescente</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>PG-13</div>
            <input
              type="radio"
              name="type"
              value="teen"
              checked={formData.type === 'teen'}
              onChange={handleChange}
              className="sr-only"
            />
          </div>
          
          <div 
            className={`p-4 border rounded-lg text-center cursor-pointer transition-colors ${
              formData.type === 'kid' 
                ? isDarkMode ? 'bg-blue-900/50 border-blue-500' : 'bg-blue-100 border-blue-300'
                : isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'kid' }))}
          >
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-700 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>Niño</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>PG</div>
            <input
              type="radio"
              name="type"
              value="kid"
              checked={formData.type === 'kid'}
              onChange={handleChange}
              className="sr-only"
            />
          </div>
        </div>
      </div>
      
      <div className={`flex justify-end space-x-3 pt-4 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 ${
            isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          } ${isDarkMode ? 'text-white' : 'text-gray-800'} rounded-lg transition-colors`}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
        >
          {profile ? 'Guardar cambios' : 'Crear perfil'}
        </button>
      </div>
    </form>
  );
};

const Profiles = () => {
  const { logout, currentUser } = useContext(AuthContext);
  const { 
    profiles, 
    loading, 
    selectProfile, 
    createProfile, 
    updateProfile, 
    deleteProfile 
  } = useContext(ProfileContext);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  
  // Manejar selección de perfil
  const handleSelectProfile = async (profile) => {
    try {
      await selectProfile(profile._id);
      navigate('/');
    } catch (error) {
      console.error('Error al seleccionar perfil:', error);
    }
  };
  
  // Manejar creación de perfil
  const handleCreateProfile = () => {
    setEditingProfile(null);
    setShowForm(true);
  };
  
  // Manejar edición de perfil
  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setShowForm(true);
  };
  
  // Manejar eliminación de perfil
  const handleDeleteProfile = (profile) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar el perfil "${profile.name}"?`,
      icon: 'warning',
      iconColor: '#9333ea',
      showCancelButton: true,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#1f2937',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: isDarkMode ? '#111827' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProfile(profile._id);
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El perfil ha sido eliminado correctamente.',
            icon: 'success',
            iconColor: '#9333ea',
            confirmButtonColor: '#9333ea',
            background: isDarkMode ? '#111827' : '#ffffff',
            color: isDarkMode ? '#f9fafb' : '#111827'
          });
        } catch (error) {
          console.error('Error al eliminar perfil:', error);
        }
      }
    });
  };
  
  // Manejar envío de formulario
  const handleSubmitForm = async (formData) => {
    try {
      if (editingProfile) {
        await updateProfile(editingProfile._id, formData);
      } else {
        await createProfile(formData);
      }
      setShowForm(false);
      setEditingProfile(null);
    } catch (error) {
      console.error('Error al guardar perfil:', error);
    }
  };
  
  // Manejar cierre de sesión
  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que quieres cerrar sesión?',
      icon: 'question',
      iconColor: '#9333ea',
      showCancelButton: true,
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#1f2937',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      background: isDarkMode ? '#111827' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        {showForm ? (
          <div className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-xl shadow-xl p-6 max-w-md mx-auto border`}>
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            } mb-6`}>
              {editingProfile ? 'Editar perfil' : 'Crear nuevo perfil'}
            </h2>
            <ProfileForm 
              profile={editingProfile}
              onSubmit={handleSubmitForm}
              onCancel={() => {
                setShowForm(false);
                setEditingProfile(null);
              }}
            />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className={`text-3xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>¿Quién está viendo?</h1>
                {currentUser && (
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    Cuenta: {currentUser.username || currentUser.email}
                  </p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 ${
                  isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } rounded-lg transition-colors flex items-center`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Cerrar sesión
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {/* Perfiles existentes */}
              {profiles.map(profile => (
                <ProfileCard 
                  key={profile._id}
                  profile={profile}
                  onSelect={() => handleSelectProfile(profile)}
                  onEdit={() => handleEditProfile(profile)}
                  onDelete={() => handleDeleteProfile(profile)}
                />
              ))}
              
              {/* Botón de añadir perfil */}
              {profiles.length < 5 && (
                <div 
                  className={`w-32 md:w-40 aspect-square rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                    isDarkMode ? 'bg-gray-800/50 border-gray-600 hover:border-gray-500' : 'bg-white/80 border-gray-300 hover:border-gray-400'
                  } border-2 border-dashed flex flex-col items-center justify-center text-center p-4`}
                  onClick={handleCreateProfile}
                >
                  <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-2`}>
                    <svg className={`w-8 h-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>Añadir perfil</p>
                </div>
              )}
            </div>
            
            {profiles.length === 0 && !showForm && (
              <div className="text-center mt-10">
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>No tienes perfiles creados aún</p>
                <button
                  onClick={handleCreateProfile}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Crear primer perfil
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profiles;