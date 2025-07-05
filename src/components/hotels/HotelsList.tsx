import { Hotel } from "../../redux/travelSlice";
import EmptyHotelsList from "./EmptyHotelsList";
import HotelCard from "./HotelCard";
import HotelsLoader from "./HotelsLoader";

interface HotelListProps {
  hotels: Hotel[];
}

const HotelList = ({ hotels }: HotelListProps) => {
  if (!hotels) {
    return <HotelsLoader />;
  }

  if (hotels.length === 0) {
    return <EmptyHotelsList />;
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
