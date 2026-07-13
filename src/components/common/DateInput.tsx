type DateInputProps = {
  value: string;
  onChange: (date: string) => void;
  label: string;
  min?: string;
};

const DateInput = ({ value, onChange, label, min }: DateInputProps) => {
  return (
    <label className="w-full text-sm font-medium text-gray-700">
      {label}
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </label>
  );
};

export default DateInput;
