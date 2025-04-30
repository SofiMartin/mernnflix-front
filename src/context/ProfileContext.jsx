import { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import profileService from '../services/profileService';
import { AuthContext } from './authContext';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar perfiles cuando el usuario esté autenticado
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!isAuthenticated) {
        setProfiles([]);
        setCurrentProfile(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await profileService.getProfiles();
        setProfiles(data);
        
        // Verificar si hay un perfil seleccionado en localStorage
        const currentProfileId = profileService.getCurrentProfileId();
        if (currentProfileId) {
          const foundProfile = data.find(p => p._id === currentProfileId);
          if (foundProfile) {
            setCurrentProfile(foundProfile);
          } else {
            // Si el perfil guardado ya no existe, limpiar localStorage
            profileService.clearCurrentProfile();
          }
        }
        
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar perfiles');
        toast.error(err.message || 'Error al cargar perfiles');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, [isAuthenticated]);
  
  // Método para seleccionar un perfil
  const selectProfile = async (profileId) => {
    try {
      const profile = profiles.find(p => p._id === profileId);
      
      if (!profile) {
        throw new Error('Perfil no encontrado');
      }
      
      profileService.setCurrentProfile(profileId);
      setCurrentProfile(profile);
      toast.success(`Perfil seleccionado: ${profile.name}`);
      return profile;
    } catch (err) {
      setError(err.message || 'Error al seleccionar perfil');
      toast.error(err.message || 'Error al seleccionar perfil');
      throw err;
    }
  };
  
  // Método para crear un perfil
  const createProfile = async (profileData) => {
    try {
      setLoading(true);
      const newProfile = await profileService.createProfile(profileData);
      
      // Actualizar el estado
      setProfiles(prev => [...prev, newProfile]);
      
      toast.success('Perfil creado con éxito');
      return newProfile;
    } catch (err) {
      setError(err.message || 'Error al crear perfil');
      toast.error(err.message || 'Error al crear perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Método para actualizar un perfil
  const updateProfile = async (profileId, profileData) => {
    try {
      setLoading(true);
      
      const updatedProfile = await profileService.updateProfile(profileId, profileData);
      
      // Actualizar el estado
      setProfiles(prev => prev.map(p => 
        p._id === profileId ? updatedProfile : p
      ));
      
      // Si el perfil actualizado es el actual, actualizarlo
      if (currentProfile && currentProfile._id === profileId) {
        setCurrentProfile(updatedProfile);
      }
      
      toast.success('Perfil actualizado con éxito');
      return updatedProfile;
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
      toast.error(err.message || 'Error al actualizar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Método para eliminar un perfil
  const deleteProfile = async (profileId) => {
    try {
      setLoading(true);
      
      await profileService.deleteProfile(profileId);
      
      // Actualizar el estado
      setProfiles(prev => prev.filter(p => p._id !== profileId));
      
      // Si el perfil eliminado es el actual, limpiar el perfil actual
      if (currentProfile && currentProfile._id === profileId) {
        setCurrentProfile(null);
        profileService.clearCurrentProfile();
      }
      
      toast.success('Perfil eliminado con éxito');
      return true;
    } catch (err) {
      setError(err.message || 'Error al eliminar perfil');
      toast.error(err.message || 'Error al eliminar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Método para cambiar el tipo de perfil
  const changeProfileType = async (profileId, type) => {
    try {
      setLoading(true);
      
      const updatedProfile = await profileService.changeProfileType(profileId, type);
      
      // Actualizar el estado
      setProfiles(prev => prev.map(p => 
        p._id === profileId ? updatedProfile : p
      ));
      
      // Si el perfil actualizado es el actual, actualizarlo
      if (currentProfile && currentProfile._id === profileId) {
        setCurrentProfile(updatedProfile);
      }
      
      toast.success(`Tipo de perfil cambiado a: ${type}`);
      return updatedProfile;
    } catch (err) {
      setError(err.message || 'Error al cambiar tipo de perfil');
      toast.error(err.message || 'Error al cambiar tipo de perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    profiles,
    currentProfile,
    loading,
    error,
    selectProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    changeProfileType
  };
  
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};