import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'url';
  error?: string;
  required?: boolean;
  placeholder?: string;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
  registration: UseFormRegisterReturn;
}

export const FormField = ({
  id,
  label,
  type = 'text',
  error,
  required = false,
  placeholder,
  isSelect = false,
  options = [],
  registration,
}: FormFieldProps) => {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field-label">
        {label} {required && '*'}
      </label>

      {isSelect ? (
        <select
          {...registration}
          id={id}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`form-field-select ${error ? 'error' : ''}`}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...registration}
          id={id}
          type={type}
          required={required}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`form-field-input ${error ? 'error' : ''}`}
        />
      )}

      {error && (
        <div
          id={`${id}-error`}
          role="alert"
          className="form-field-error"
        >
          {error}
        </div>
      )}
    </div>
  );
};
