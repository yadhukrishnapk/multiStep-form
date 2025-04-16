import React, { useState, useEffect } from 'react';
import { Form, Multistep, useFormState } from 'informed';
import './MultiStepForm.css';
import StepIndicator from './steps/StepIndicator';
import Info from './steps/Info';
import Contact from './steps/Contact';
import Additional from './steps/Additional';
import Review from './steps/Review';
import useFormDraft from '../../hooks/useFormDraft';
import usePreventUnload from '../../hooks/usePreventUnload';

// Form State Observer - helps track changes for localStorage
const FormStateObserver = () => {
  const formState = useFormState();
  const { saveNow } = useFormDraft('registration-form-draft');
  
  useEffect(() => {
    // Save form state whenever it changes
    if (formState.values && Object.keys(formState.values).length > 0) {
      saveNow();
    }
  }, [formState, saveNow]);
  
  return null;
};

// Main Form Component
const MultiStepForm = () => {
  const [currentStepName, setCurrentStepName] = useState('info');
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const stepNames = ['info', 'contact', 'additional', 'review'];
  const STORAGE_KEY = 'registration-form-draft';
  const { isDraftSaved, saveNow, clearDraft } = useFormDraft(STORAGE_KEY);
  
  // Try to load the saved data from localStorage on initial render
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        if (parsedDraft && typeof parsedDraft === 'object') {
          // Extract the current step if it exists
          if (parsedDraft._currentStep && stepNames.includes(parsedDraft._currentStep)) {
            setCurrentStepName(parsedDraft._currentStep);
          }
          
          // Remove the _currentStep from the values for form initialization
          const { _currentStep, ...formValues } = parsedDraft;
          setInitialValues(formValues);
        }
      }
    } catch (error) {
      console.error('Failed to load saved form data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Add the unload prevention hook
  usePreventUnload(STORAGE_KEY);

  const handleStepChange = (step) => {
    if (stepNames.includes(step)) {
      setCurrentStepName(step);
      
      // First save the form data with the updated step
      saveNow((currentValues) => {
        return {
          ...currentValues,
          _currentStep: step
        };
      });
    }
  };

  const handleSubmit = (formState) => {
    console.log('Form submitted with values:', formState.values);
    alert('Form submitted successfully!\n' + JSON.stringify(formState.values, null, 2));
    
    // Clear the draft from localStorage after successful submission
    clearDraft();
  };

  if (isLoading) {
    return <div className="loading">Loading saved form data...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Registration Form</h1>
      </div>
      
      <div className={`draft-saved ${isDraftSaved ? 'visible' : ''}`}>
        Draft saved
      </div>

      <Form 
        onSubmit={handleSubmit} 
        autoComplete="off" 
        initialValues={initialValues}
      >
        <FormStateObserver />
        <Multistep current={currentStepName} onChange={handleStepChange}>
          <StepIndicator />
          <Info />
          <Contact />
          <Additional />
          <Review />
        </Multistep>
        <div className="button-group">
          <button type="button" onClick={clearDraft} className="clear-btn">
            Clear Draft
          </button>
        </div>
      </Form>
    </div>
  );
};

export default MultiStepForm;