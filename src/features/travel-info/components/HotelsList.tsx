import type { Hotel } from "../../../../shared/api/contracts";
import EmptyHotelsList from "./EmptyHotelsList";
import HotelCard from "./HotelCard";

interface HotelListProps {
  hotels: Hotel[];
}

const HotelList = ({ hotels }: HotelListProps) => {
  if (hotels.length === 0) {
    return <EmptyHotelsList />;
  }

  return (
    <div className="mb-8 p-10">
      <h2 className="text-xl font-bold mb-4">Available Hotels</h2>
      <div className="mb-4">
        <span className="text-sm text-gray-600">
          {hotels.length} hotels found
        </span>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel) => (
          <HotelCard
            key={`${hotel.hotelName}-${hotel.location}`}
            hotel={hotel}
          />
        ))}
      </div>
    </div>
  );
};

export default HotelList;
