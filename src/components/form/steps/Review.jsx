import React from 'react';
import { Multistep, useMultistepApi, useFormApi } from 'informed';
import useFormDraft from '../../../hooks/useFormDraft';

// Step 4: Review
const Review = () => {
  const { previous } = useMultistepApi();
  const { formState } = useFormApi();
  const { saveNow } = useFormDraft('registration-form-draft');
  const values = formState?.values || {};

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
              <span className="review-value">{values.firstName || '-'}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Last Name:</span>
              <span className="review-value">{values.lastName || '-'}</span>
            </div>
          </div>

          <div className="review-section">
            <h3>Contact Details</h3>
            <div className="review-item">
              <span className="review-label">Email:</span>
              <span className="review-value">{values.email || '-'}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Phone:</span>
              <span className="review-value">{values.phone || '-'}</span>
            </div>
          </div>

          <div className="review-section">
            <h3>Additional Information</h3>
            <div className="review-item">
              <span className="review-label">Address:</span>
              <span className="review-value">{values.address || '-'}</span>
            </div>
            <div className="review-item">
              <span className="review-label">City:</span>
              <span className="review-value">{values.city || '-'}</span>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button type="button" onClick={handlePrevious} className="prev-btn">
            <span className="btn-icon">←</span> Previous
          </button>
          <button type="submit" className="submit-btn">
            Submit <span className="btn-icon">✓</span>
          </button>
        </div>
      </div>
    </Multistep.Step>
  );
};

export default Review;