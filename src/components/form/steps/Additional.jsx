import React from 'react';
import { Multistep, useMultistepApi } from 'informed';
import InputField from '../../input/InputField';
import { MapPin, Building } from 'lucide-react';
import { validateRequiredLength } from './Info';
import useFormDraft from '../../../hooks/useFormDraft';

// Step 3: Additional Information
const Additional = () => {
  const { next, previous } = useMultistepApi();
  const { saveNow } = useFormDraft('registration-form-draft');
  
  const handleNext = () => {
    // Save the draft immediately before navigating with the next step
    saveNow((currentValues) => {
      return {
        ...currentValues,
        _currentStep: 'review'
      };
    });
    next();
  };

  const handlePrevious = () => {
    // Save when going to previous step with the updated step
    saveNow((currentValues) => {
      return {
        ...currentValues,
        _currentStep: 'contact'
      };
    });
    previous();
  };
  
  return (
    <Multistep.Step step="additional">
      <div className="form-section fade-in">
        <h2>Additional Information</h2>
        <p className="section-description">Tell us where you're from</p>
        
        <InputField
          name="address"
          label="Address"
          placeholder="Enter your address"
          validate={validateRequiredLength}
          validateOn="change"
          required
          icon={<MapPin size={18} />}
        />
        <InputField
          name="city"
          label="City"
          placeholder="Enter your city"
          validate={validateRequiredLength}
          validateOn="change"
          required
          icon={<Building size={18} />}
        />
        <div className="button-group">
          <button type="button" onClick={handlePrevious} className="prev-btn">
            <span className="btn-icon">←</span> Previous
          </button>
          <button type="button" onClick={handleNext} className="next-btn">
            Review <span className="btn-icon">→</span>
          </button>
        </div>
      </div>
    </Multistep.Step>
  );
};

export default Additional;