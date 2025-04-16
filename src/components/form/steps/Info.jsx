import React from 'react';
import { Multistep, useMultistepApi } from 'informed';
import InputField from '../../input/InputField';
import { User } from 'lucide-react';
import useFormDraft from '../../../hooks/useFormDraft';

// Validation Function
const validateRequiredLength = (value) => {
  if (!value) return 'This field is required';
  if (value.length < 5) return 'Field must be at least five characters';
  return undefined;
};

// Step 1: Personal Information
const Info = () => {
  const { next } = useMultistepApi();
  const { saveNow } = useFormDraft('registration-form-draft');
  
  const handleNext = () => {
    // Save the draft immediately before navigating with the next step
    saveNow((currentValues) => {
      return {
        ...currentValues,
        _currentStep: 'contact'
      };
    });
    next();
  };
  
  return (
    <Multistep.Step step="info">
      <div className="form-section fade-in">
        <h2>Personal Information</h2>
        <p className="section-description">Tell us about yourself</p>
        
        <InputField
          name="firstName"
          label="First Name"
          placeholder="Enter your first name"
          validate={validateRequiredLength}
          validateOn="change"
          required
          icon={<User size={18} />}
        />
        <InputField
          name="lastName"
          label="Last Name"
          placeholder="Enter your last name"
          validate={validateRequiredLength}
          validateOn="change"
          required
          icon={<User size={18} />}
        />
        <div className="button-group">
          <button type="button" onClick={handleNext} className="next-btn">
            Next <span className="btn-icon">→</span>
          </button>
        </div>
      </div>
    </Multistep.Step>
  );
};

export { validateRequiredLength };
export default Info;