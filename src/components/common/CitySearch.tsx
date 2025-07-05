import React, { useState, useEffect, useRef } from "react";
import { getAirport } from "../../utils/getFlights";
import { LocationData } from "../../utils/types";

interface CitySearchProps {
  onQueryChange?: (query: string) => void;
  onCitySelect?: (city: LocationData) => void;
  defaultValue?: string;
}

const CitySearch: React.FC<CitySearchProps> = ({
  onQueryChange,
  onCitySelect,
  defaultValue = "",
}) => {
  const [query, setQuery] = useState<string>(defaultValue);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to fetch city data from API
  const fetchCities = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setLocations([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getAirport(query);
      if (!response) {
        throw new Error("Failed to fetch city data");
      }

      const data = response.data.data;
      setLocations(data);
      setShowDropdown(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Notify parent component about the query change
    if (onQueryChange) {
      onQueryChange(value);
    }

    // Clear any existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout to delay the API call
    debounceTimeout.current = setTimeout(() => {
      fetchCities(value);
    }, 500);
  };

  // Handle city selection
  const handleCitySelect = (location: LocationData) => {
    setQuery(location.iataCode);
    setShowDropdown(false);

    // Notify parent component about the selected city
    if (onQueryChange) {
      onQueryChange(location.iataCode);
    }

    if (onCitySelect) {
      onCitySelect(location);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <div className="city-search-container relative w-full max-w-md">
      <div className="input-wrapper relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter city name"
          className="w-full p-2 border border-gray-300 rounded"
          aria-label="Search for a city"
          aria-expanded={showDropdown}
          aria-controls="city-dropdown"
        />
        {isLoading && (
          <div className="absolute right-2 top-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-solid border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>

      {error && <div className="text-red-500 mt-1">{error}</div>}

      {showDropdown && locations.length > 0 && (
        <div
          id="city-dropdown"
          ref={dropdownRef}
          className="dropdown-container absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
        >
          {locations.map((location) => (
            <div
              key={location.id}
              className="dropdown-item p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCitySelect(location)}
            >
              <div className="font-medium">{location.name}</div>
              <div className="text-sm text-gray-600">
                {location.address.cityName}, {location.address.countryName} (
                {location.iataCode})
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown &&
        query.length >= 2 &&
        locations.length === 0 &&
        !isLoading && (
          <div className="dropdown-container absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg p-2">
            No cities found
          </div>
        )}
    </div>
  );
};

export default CitySearch;
