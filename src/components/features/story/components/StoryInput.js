export const StoryInput = ({ value, onChange, disabled }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={6}
    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
    placeholder="텍스트를 입력하세요"
    disabled={disabled}
  />
);