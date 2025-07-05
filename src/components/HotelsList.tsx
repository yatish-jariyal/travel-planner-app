import React from "react";
import { Hotel } from "../redux/travelSlice";
import HotelCard from "./HotelCard";

interface HotelListProps {
  hotels: Hotel[];
}

const HotelList: React.FC<HotelListProps> = ({ hotels }) => {
  if (!hotels) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading hotels...</span>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <h3 className="font-medium">No hotels found</h3>
        <p className="text-sm text-gray-600 mt-1">
          Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8 p-10">
      <h2 className="text-xl font-bold mb-4">Available Hotels</h2>
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {hotels.length} hotels found
        </span>
        <select className="border rounded p-1 text-sm">
          <option>Sort by: Recommended</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating: High to Low</option>
        </select>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default HotelList;
