import React, { useState } from 'react';
import { useField } from 'informed';
import { AlertCircle } from 'lucide-react';

const InputField = ({
  label,
  name,
  fieldType = 'text',
  validate,
  required = false,
  placeholder,
  validateOn,
  icon,
  ...props
}) => {
  const { fieldState, fieldApi, render } = useField({
    name,
    validate,
    validateOn,
  });

  const { error, value, touched } = fieldState;
  const inputId = `${name}-input`;
  const errorId = `${name}-error`;
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const actualFieldType = fieldType === 'password' ? (showPassword ? 'text' : 'password') : fieldType;

  return render(
    <div className="mb-3">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className={`input-group ${isFocused ? 'focused' : ''}`}>
        {icon && (
          <div className="input-icon">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={actualFieldType}
          value={value || ''}
          onChange={(e) => fieldApi.setValue(e.target.value)}
          onBlur={() => {
            fieldApi.setTouched(true);
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          className={`form-control ${error && touched ? 'is-invalid' : ''}`}
          placeholder={placeholder || `Enter ${label?.toLowerCase()}`}
          aria-invalid={!!error && touched}
          aria-describedby={error && touched ? errorId : undefined}
          required={false} // Prevent HTML5 validation
          {...props}
        />
        {fieldType === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {touched && error && (
        <div id={errorId} className="invalid-feedback">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default InputField;