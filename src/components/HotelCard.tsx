import React from "react";

interface Hotel {
  hotelName: string;
  stars: string;
  availability: string;
  price: string;
  description: string;
  location: string;
  ratings: string;
}

const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{hotel.hotelName}</h3>
      <p> {Number(hotel.stars) > 0 ? "⭐".repeat(Number(hotel.stars)) : ""}</p>
      <div className="mt-2">
        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {hotel.availability}
        </span>
      </div>
      <p className="mt-2 font-medium">{hotel.price}</p>
      <p className="mt-2 text-sm text-gray-600">{hotel.description}</p>
      <p className="mt-2 text-sm">Location: {hotel.location}</p>
      <div className="mt-2 flex items-center">
        <span className="text-sm">Rating: {hotel.ratings}</span>
      </div>
    </div>
  );
};

export default HotelCard;
