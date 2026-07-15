type SubmitButtonProps = {
  isLoading: boolean;
};

const SubmitButton = ({ isLoading }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className="rounded-lg py-3 px-8 bg-teal-700 text-white cursor-pointer hover:bg-teal-800 transition-colors duration-300 font-medium text-lg w-full max-w-md shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      {isLoading ? "Processing..." : "Generate Itinerary"}
    </button>
  );
};

export default SubmitButton;
