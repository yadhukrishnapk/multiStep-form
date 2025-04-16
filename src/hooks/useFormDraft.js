import { useEffect, useCallback, useRef, useState } from 'react';
import { useFormApi, useFormState } from 'informed';

const useFormDraft = (storageKey) => {
  const formApi = useFormApi();
  const { values } = useFormState();
  const prevValuesRef = useRef({});
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const saveTimeoutRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Save form values to localStorage on change with debounce
  const saveDraft = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        if (values && typeof values === 'object') {
          // Preserve the current step if it exists
          const savedDraft = localStorage.getItem(storageKey);
          let currentStep = null;
          
          try {
            if (savedDraft) {
              const parsedDraft = JSON.parse(savedDraft);
              if (parsedDraft && parsedDraft._currentStep) {
                currentStep = parsedDraft._currentStep;
              }
            }
          } catch (e) {
            console.error('Error parsing saved draft:', e);
          }
          
          // Combine current values with stored step
          const dataToStore = {
            ...values,
            ...(currentStep ? { _currentStep: currentStep } : {})
          };
          
          localStorage.setItem(storageKey, JSON.stringify(dataToStore));
          prevValuesRef.current = { ...values };
          
          setIsDraftSaved(true);
          setTimeout(() => {
            setIsDraftSaved(false);
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to save form draft:', error);
      }
    }, 500); // Reduced to 500ms for better responsiveness
  }, [storageKey, values]);

  // Immediate save draft function to use when clicking "Next"/"Previous"
  const saveNow = useCallback((modifierFn = null) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    try {
      if (values && typeof values === 'object') {
        // Preserve the current step if it exists
        const savedDraft = localStorage.getItem(storageKey);
        let currentStep = null;
        
        try {
          if (savedDraft) {
            const parsedDraft = JSON.parse(savedDraft);
            if (parsedDraft && parsedDraft._currentStep) {
              currentStep = parsedDraft._currentStep;
            }
          }
        } catch (e) {
          console.error('Error parsing saved draft:', e);
        }
        
        // Combine current values with stored step
        let dataToStore = {
          ...values,
          ...(currentStep ? { _currentStep: currentStep } : {})
        };
        
        // Apply any modifiers if provided (useful for updating step)
        if (modifierFn && typeof modifierFn === 'function') {
          dataToStore = modifierFn(dataToStore);
        }
        
        localStorage.setItem(storageKey, JSON.stringify(dataToStore));
        prevValuesRef.current = { ...values };
        
        setIsDraftSaved(true);
        setTimeout(() => {
          setIsDraftSaved(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to save form draft:', error);
    }
  }, [storageKey, values]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      prevValuesRef.current = {};
      setIsDraftSaved(false);
      formApi.reset(); // Reset form to initial state
    } catch (error) {
      console.error('Failed to clear form draft:', error);
    }
  }, [storageKey, formApi]);

  // Detect form value changes and save draft
  useEffect(() => {
    // Don't trigger save on initial render
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      return;
    }
    
    if (values && typeof values === 'object' && Object.keys(values).length > 0) {
      const hasChanged = JSON.stringify(values) !== JSON.stringify(prevValuesRef.current);
      if (hasChanged) {
        saveDraft();
      }
    }
  }, [values, saveDraft]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return { isDraftSaved, saveDraft, saveNow, clearDraft };
};

export default useFormDraft;