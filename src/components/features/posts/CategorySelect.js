import React from 'react';

const CategorySelect = ({ value, options, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm min-w-[120px]"
    >
      {options.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;