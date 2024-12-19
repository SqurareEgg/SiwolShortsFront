export const ToneSelect = ({ value, options, onChange, disabled }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
  >
    {Object.entries(options).map(([key]) => (
      <option key={key} value={key}>{key}</option>
    ))}
  </select>
);