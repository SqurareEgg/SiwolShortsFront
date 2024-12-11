import React from 'react';

const Input = ({
  label,
  error,
  className = '',
  type = 'text',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 py-2 bg-gray-700 rounded-lg text-white
          border border-gray-600 
          focus:border-blue-500 focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;