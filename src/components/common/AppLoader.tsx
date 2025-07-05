import { LocationData } from "../../utils/types";

type AppLoaderProps = {
  city?: LocationData | null;
};

const AppLoader = ({ city }: AppLoaderProps) => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-md">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 mb-4">
          <svg
            className="animate-spin w-full h-full text-teal-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-teal-700 font-bold text-xl">
            Finding Your Perfect Itinerary
          </p>
          <p className="text-gray-600 mt-2">
            Exploring options for {city?.address.cityName}...
          </p>
          <div className="flex items-center justify-center mt-4 space-x-1">
            <div
              className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
