type DateInputProps = {
  value: string;
  onChange: (date: string) => void;
  placeholder: string;
};

const DateInput = ({ value, onChange, placeholder }: DateInputProps) => {
  return (
    <input
      type="date"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
    />
  );
};

export default DateInput;
