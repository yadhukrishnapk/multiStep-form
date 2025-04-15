import React from 'react';
import { Multistep, useMultistepApi } from 'informed';
import InputField from '../../input/InputField';
import { Mail, Phone } from 'lucide-react';

// Validation Functions
const validateEmail = (value) => {
  if (!value) return 'This field is required';
  if (value.length < 5) return 'Field must be at least five characters';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !emailRegex.test(value) ? 'Please enter a valid email' : undefined;
};

const validatePhone = (value) => {
  if (!value) return 'This field is required';
  if (value.length < 5) return 'Field must be at least five characters';
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return !phoneRegex.test(value) ? 'Please enter a valid phone number' : undefined;
};

// Step 2: Contact Information
const Contact = () => {
  const { next, previous } = useMultistepApi();
  
  return (
    <Multistep.Step step="contact">
      <div className="form-section fade-in">
        <h2>Contact Details</h2>
        <p className="section-description">How can we reach you?</p>
        
        <InputField
          name="email"
          label="Email Address"
          fieldType="email"
          placeholder="Enter your email"
          validate={validateEmail}
          validateOn="change"
          required
          icon={<Mail size={18} />}
        />
        <InputField
          name="phone"
          label="Phone Number"
          fieldType="tel"
          placeholder="Enter your phone number"
          validate={validatePhone}
          validateOn="change"
          required
          icon={<Phone size={18} />}
        />
        <div className="button-group">
          <button type="button" onClick={previous} className="prev-btn">
            <span className="btn-icon">←</span> Previous
          </button>
          <button type="button" onClick={next} className="next-btn">
            Next <span className="btn-icon">→</span>
          </button>
        </div>
      </div>
    </Multistep.Step>
  );
};

export { validateEmail, validatePhone };
export default Contact;