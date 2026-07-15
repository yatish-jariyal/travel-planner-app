import { useState, useEffect, useId, useRef } from "react";
import type { ChangeEvent } from "react";
import { getAirport } from "../../utils/getFlights";
import { getApiErrorMessage } from "../../utils/apiClient";
import { LocationData } from "../../utils/types";

interface CitySearchProps {
  onQueryChange?: (query: string) => void;
  onCitySelect?: (city: LocationData) => void;
  defaultValue?: string;
  label: string;
}

const CitySearch = ({
  onQueryChange,
  onCitySelect,
  defaultValue = "",
  label,
}: CitySearchProps) => {
  const [query, setQuery] = useState<string>(defaultValue);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const dropdownId = `${inputId}-options`;

  const fetchCities = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setLocations([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const locations = await getAirport(searchQuery);
      setLocations(locations);
      setShowDropdown(true);
    } catch (error) {
      setError(getApiErrorMessage(error, "Unable to search airports."));
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (onQueryChange) {
      onQueryChange(value);
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchCities(value);
    }, 500);
  };

  const handleCitySelect = (location: LocationData) => {
    const selectedValue = location.flightSearchCode
      ? location.address.cityName
      : location.iataCode;
    setQuery(selectedValue);
    setShowDropdown(false);

    if (onQueryChange) {
      onQueryChange(selectedValue);
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
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="input-wrapper relative">
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter city name"
          className="w-full p-2 border border-gray-300 rounded"
          aria-label={`${label} city search`}
          aria-expanded={showDropdown}
          aria-controls={dropdownId}
          aria-autocomplete="list"
          role="combobox"
        />
        {isLoading && (
          <div className="absolute right-2 top-2">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-solid border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-600 mt-1" role="alert">
          {error}
        </div>
      )}

      {showDropdown && locations.length > 0 && (
        <div
          id={dropdownId}
          ref={dropdownRef}
          role="listbox"
          className="dropdown-container absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
        >
          {locations.map((location) => (
            <button
              type="button"
              key={location.id}
              role="option"
              aria-selected="false"
              className="dropdown-item block w-full p-2 text-left hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCitySelect(location)}
            >
              <div className="font-medium">{location.name}</div>
              <div className="text-sm text-gray-600">
                {location.address.cityName}, {location.address.countryName} (
                {location.flightSearchCode
                  ? `all: ${location.flightSearchCode.replace(/,/g, ", ")}`
                  : location.iataCode}
                )
              </div>
            </button>
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
