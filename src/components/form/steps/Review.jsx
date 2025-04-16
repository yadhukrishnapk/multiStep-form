import React from 'react';
import { Multistep, useMultistepApi, useFormState } from 'informed';
import useFormDraft from '../../../hooks/useFormDraft';

// Step 4: Review
const Review = ({ formData }) => {
  const { previous } = useMultistepApi();
  const { values } = useFormState();
  const { saveNow, clearDraft } = useFormDraft('registration-form-draft');
  
  // Use either passed formData or values from useFormState
  const formValues = formData || values || {};
  console.log('Form Values in Review:', formValues);
  
  const handlePrevious = () => {
    // Save when going to previous step with the updated step
    saveNow((currentValues) => {
      return {
        ...currentValues,
        _currentStep: 'additional'
      };
    });
    previous();
  };

  const handleSubmit = (e) => {
    // The form submission is handled by the parent component
    // But we can add additional functionality here if needed
    // Note: Don't call e.preventDefault() as we want the form to submit
  };

  return (
    <Multistep.Step step="review">
      <div className="form-section fade-in">
        <h2>Review Your Information</h2>
        <p className="section-description">Please verify that everything is correct</p>

        <div className="review-container">
          <div className="review-section">
            <h3>Personal Information</h3>
            <div className="review-item">
              <span className="review-label">First Name:</span>
              <span className="review-value">{formValues.info?.firstName || '-'}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Last Name:</span>
              <span className="review-value">{formValues.info?.lastName || '-'}</span>
            </div>
          </div>

          <div className="review-section">
            <h3>Contact Details</h3>
            <div className="review-item">
              <span className="review-label">Email:</span>
              <span className="review-value">{formValues?.contact?.email || '-'}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Phone:</span>
              <span className="review-value">{formValues.contact?.phone || '-'}</span>
            </div>
          </div>

          <div className="review-section">
            <h3>Additional Information</h3>
            <div className="review-item">
              <span className="review-label">Address:</span>
              <span className="review-value">{formValues.additional?.address || '-'}</span>
            </div>
            <div className="review-item">
              <span className="review-label">City:</span>
              <span className="review-value">{formValues.additional?.city || '-'}</span>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button type="button" onClick={handlePrevious} className="prev-btn">
            <span className="btn-icon">←</span> Previous
          </button>
          <button type="submit" onClick={handleSubmit} className="submit-btn">
            Submit <span className="btn-icon">✓</span>
          </button>
        </div>
      </div>
    </Multistep.Step>
  );
};

export default Review;