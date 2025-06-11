import { useState, useEffect } from "react";
import { EditUserData, UserDetails } from "../../domain";
import { useAppStore } from "../store/useAppStore";
import { editUserService, getUserDetailsService } from "../../infrastructure/services/userService";


export const useGetUserDetails = () => {
    const [error, setError] = useState('')
    const [isDetailLoading, setIsDetailLoading] = useState(false)
    const user = useAppStore((state) => state.user);
    const [userDetails, setUserDetails] = useState<UserDetails>({...user});

  const handleGetDetails = async () => {
    setIsDetailLoading(true);
    setError('');
    
    try {
      const userDetailsData = await getUserDetailsService();
      setUserDetails(userDetailsData);
    } catch (error: any) {
      const err = error as Error;
      setError(err.message || "Error desconocido");
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    handleGetDetails();
  }, []); 

  return { userDetails, isDetailLoading, error, refetch: handleGetDetails };
};


export const useEditProfile = () => {
        const [saveError, setSaveError] = useState('')
        const [isSaveLoading, setIsSaveLoading] = useState(false)
        const setNewProfile = useAppStore((state) => state.setNewProfile);
    
      const handleSaveProfile = async (formData: EditUserData) => {
        setIsSaveLoading(true);
        setSaveError('');
        
        
        try {
          const userLogedData = await editUserService(formData);
          await setNewProfile(userLogedData);
          localStorage.removeItem('token');
        
        } catch (error: any) {
            const err = error as Error;
          setSaveError(err.message || "Error desconocido");
        } finally {
          setIsSaveLoading(false);
        }
      };
    
      return { handleSaveProfile, isSaveLoading, saveError };
};