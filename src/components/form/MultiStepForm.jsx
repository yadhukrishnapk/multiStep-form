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
const FormStateObserver = ({ onStateChange }) => {
  const formState = useFormState();
  const { saveNow } = useFormDraft('registration-form-draft');
  
  useEffect(() => {
    // Save form state whenever it changes
    if (formState.values && Object.keys(formState.values).length > 0) {
      saveNow();
      // Pass the updated values to parent component
      onStateChange(formState.values);
    }
  }, [formState, saveNow, onStateChange]);
  
  return null;
};

// Main Form Component
const MultiStepForm = () => {
  const [currentStepName, setCurrentStepName] = useState('info');
  const [initialValues, setInitialValues] = useState({});
  const [formValues, setFormValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stepNames = ['info', 'contact', 'additional', 'review'];
  const STORAGE_KEY = 'registration-form-draft';
  const { isDraftSaved, saveNow, clearDraft } = useFormDraft(STORAGE_KEY);
  
  // Try to load the saved data from localStorage on initial render
  useEffect(() => {
    if (isSubmitted) {
      // If form is submitted, don't load data from localStorage
      setIsLoading(false);
      return;
    }
    
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
          setFormValues(formValues);
          console.log('Loaded saved form data:', formValues);
        }
      }
    } catch (error) {
      console.error('Failed to load saved form data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isSubmitted]);
  
  // Add the unload prevention hook - but disable it after submission
  usePreventUnload(isSubmitted ? null : STORAGE_KEY);

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

  const handleFormStateChange = (values) => {
    setFormValues(values);
  };

  const handleSubmit = (formState) => {
    console.log('Form submitted with values:', formState.values);
    
    // Clear the draft from localStorage after successful submission
    clearDraft();
    
    // Reset the form state
    setIsSubmitted(true);
    setInitialValues({});
    setFormValues({});
    setCurrentStepName('info');
    
    alert('Form submitted successfully!\n' + JSON.stringify(formState.values, null, 2));
    
    // If you want to redirect after submission, you can do it here
    // For example: window.location.href = '/thank-you';
  };

  const handleClearDraft = () => {
    clearDraft();
    setInitialValues({});
    setFormValues({});
    setCurrentStepName('info');
    
    // Force reload the page to ensure all form states are reset
    window.location.reload();
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
        key={isSubmitted ? 'submitted-form' : 'draft-form'} // Force re-render after submission
      >
        <FormStateObserver onStateChange={handleFormStateChange} />
        <Multistep current={currentStepName} onChange={handleStepChange}>
          <StepIndicator />
          <Info />
          <Contact />
          <Additional />
          <Review formData={formValues} />
        </Multistep>
        <div className="button-group">
          <button type="button" onClick={handleClearDraft} className="clear-btn">
            Clear Draft
          </button>
        </div>
      </Form>
    </div>
  );
};

export default MultiStepForm;