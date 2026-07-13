import { Hotel } from "../../redux/travelSlice";

const HotelCard = ({ hotel }: { hotel: Hotel }) => {
  const starCount = Math.min(5, Math.max(0, Math.floor(Number(hotel.stars))));

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{hotel.hotelName}</h3>
      {starCount > 0 && (
        <p aria-label={`${starCount} star hotel`}>{"⭐".repeat(starCount)}</p>
      )}
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
