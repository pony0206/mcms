// components/Select.tsx
import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[] | string[] | number[] | boolean[] | object[] | any[] | undefined;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
  isMulti?: boolean;
  key?: string;
  required?: boolean;
  name?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select options',
  disabled = false,
  error = '',
  className = '',
  id,
  isMulti = false,
  key,
  name,
  required,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    onChange(isMulti ? selectedOptions : selectedOptions[0]);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-1 ${
          error ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {label}
        </label>
      )}
      <select
        id={id}
        name={name}
        key={key}
        multiple={isMulti}
        value={Array.isArray(value) ? value : [value]}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className={`block w-full px-4 py-2 pr-8 leading-tight rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:focus:ring-blue-600 dark:focus:border-blue-600 ${
          error
            ? 'border-red-500 dark:border-red-400'
            : 'border-gray-300 dark:border-gray-600'
        } ${disabled ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
        style={{ appearance: 'none' }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options && options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label ?? option.value}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400 dark:text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6.293 6.707a1 1 0 0 1 1.414 0L10 9.414l2.293-2.707a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default Select;