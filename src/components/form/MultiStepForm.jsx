import React, { useState } from 'react';
import { Form, Multistep } from 'informed';
import './MultiStepForm.css';
import StepIndicator from './steps/StepIndicator'; // Updated import
import Info from './steps/Info';
import Contact from './steps/Contact';
import Additional from './steps/Additional';
import Review from './steps/Review';

// Main Form Component
const MultiStepForm = () => {
  const [currentStepName, setCurrentStepName] = useState('info');
  const stepNames = ['info', 'contact', 'additional', 'review'];

  const handleStepChange = (step) => {
    if (stepNames.includes(step)) {
      setCurrentStepName(step);
    }
  };

  const handleSubmit = (formState) => {
    console.log('Form submitted with values:', formState.values);
    alert('Form submitted successfully!\n' + JSON.stringify(formState.values, null, 2));
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Registration Form</h1>
      </div>

      <Form onSubmit={handleSubmit} autoComplete="off">
        <Multistep current={currentStepName} onChange={handleStepChange}>
        <StepIndicator />
          <Info />
          <Contact />
          <Additional />
          <Review />
        </Multistep>
      </Form>
    </div>
  );
};

export default MultiStepForm;