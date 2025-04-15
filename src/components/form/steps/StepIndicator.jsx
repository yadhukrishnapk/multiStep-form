import React from 'react';
import { User, Mail, BookOpen, CheckCircle } from 'lucide-react';
import { useMultistepApi, useFieldState, useMultistepState } from 'informed';

// Step Item Component
const StepItem = ({ step, label, icon, number, isComplete }) => {
  const multiStepState = useMultistepState();
  if (!multiStepState) return null;

  const { current } = multiStepState;
  const { setCurrent } = useMultistepApi();
  const state = useFieldState(step);

  const isActive = current === step;
  const isCompleted = isComplete(state);
  const canNavigate = isCompleted || isActive;

  return (
    <div className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
      <div 
        className="step-icon"
        onClick={() => canNavigate && setCurrent(step)}
        style={{ cursor: canNavigate ? 'pointer' : 'default' }}
      >
        {isCompleted ? <CheckCircle size={24} /> : icon}
        <div className="step-pulse"></div>
      </div>
      <div className="step-label">{label}</div>
      {number < 4 && (
        <div className={`step-connector ${isCompleted ? 'completed' : ''}`}></div>
      )}
    </div>
  );
};

// Step Indicator Component
const StepIndicator = () => {
  const steps = [
    {
      name: 'info',
      label: 'Personal Info',
      icon: <User size={24} />,
      number: 1,
      isComplete: (state) => state?.value?.firstName && state?.value?.lastName,
    },
    {
      name: 'contact',
      label: 'Contact Details',
      icon: <Mail size={24} />,
      number: 2,
      isComplete: (state) => state?.value?.email && state?.value?.phone,
    },
    {
      name: 'additional',
      label: 'Additional Info',
      icon: <BookOpen size={24} />,
      number: 3,
      isComplete: (state) => state?.value?.address && state?.value?.city,
    },
    {
      name: 'review',
      label: 'Review',
      icon: <CheckCircle size={24} />,
      number: 4,
      isComplete: () => false,
    }
  ];

  return (
    <div className="step-indicator">
      {steps.map((step) => (
        <StepItem
          key={step.name}
          step={step.name}
          label={step.label}
          icon={step.icon}
          number={step.number}
          isComplete={step.isComplete}
        />
      ))}
    </div>
  );
};

export default StepIndicator;