import React, { useState, useEffect } from 'react';
import { Form, Multistep } from 'informed';
import { useNavigate } from 'react-router-dom';
import './MultiStepForm.css';
import StepIndicator from './steps/StepIndicator';
import Info from './steps/Info';
import Contact from './steps/Contact';
import Additional from './steps/Additional';
import Review from './steps/Review';
import useFormDraft from '../../hooks/useFormDraft';
import usePreventUnload from '../../hooks/usePreventUnload';

const MultiStepForm = () => {
  const [currentStepName, setCurrentStepName] = useState('info');
  const [initialValues, setInitialValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const stepNames = ['info', 'contact', 'additional', 'review'];
  const STORAGE_KEY = 'registration-form-draft';
  const { isDraftSaved, saveNow, clearDraft } = useFormDraft(STORAGE_KEY);
  const navigate = useNavigate();

  // Load saved data from localStorage on initial render
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_KEY);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        if (parsedDraft && typeof parsedDraft === 'object') {
          if (parsedDraft._currentStep && stepNames.includes(parsedDraft._currentStep)) {
            setCurrentStepName(parsedDraft._currentStep);
          }
          const { _currentStep, ...formValues } = parsedDraft;
          setInitialValues(formValues);
        }
      }
    } catch (error) {
      console.error('Failed to load saved form data:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, [stepNames]);

  usePreventUnload(STORAGE_KEY);

  const handleStepChange = (step) => {
    if (stepNames.includes(step)) {
      setCurrentStepName(step);
      saveNow((currentValues) => ({
        ...currentValues,
        _currentStep: step
      }));
    }
  };

  const handleSubmit = (formState) => {
    console.log('Form submitted with values:', formState.values);
    clearDraft();
    navigate('/thank-you');
  };

  const handleClearDraft = () => {
    clearDraft();
    setInitialValues({});
    setCurrentStepName('info');
    window.location.reload();
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
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
        <Multistep current={currentStepName} onChange={handleStepChange}>
          <StepIndicator />
          <Info />
          <Contact />
          <Additional />
          <Review />
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