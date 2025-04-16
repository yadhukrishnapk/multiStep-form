import { useEffect } from 'react';

const usePreventUnload = (storageKey) => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Check if there's a draft saved
      const savedDraft = localStorage.getItem(storageKey);
      
      if (savedDraft) {
        // Standard way to show a confirmation dialog
        const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = confirmationMessage; // For older browsers
        return confirmationMessage; // For modern browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [storageKey]);
};

export default usePreventUnload;