import { Attraction } from "../../redux/travelSlice";
import AttractionCard from "./AttractionCard";
import AttractionsLoader from "./AttractionsLoader";
import EmptyAttractionsList from "./EmptyAttractionsList";

interface AttractionsListProps {
  attractions: Attraction[];
}

const AttractionsList = ({ attractions }: AttractionsListProps) => {
  if (!attractions) {
    return <AttractionsLoader />;
  }

  if (attractions.length === 0) {
    return <EmptyAttractionsList />;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Popular Attractions</h2>

      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {attractions.length} attractions found
        </span>
        <select className="border rounded p-1 text-sm">
          <option>Sort by: Recommended</option>
          <option>Rating: High to Low</option>
          <option>Entry Fee: Low to High</option>
          <option>Entry Fee: High to Low</option>
        </select>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {attractions.map((attraction, index) => (
          <AttractionCard key={index} attraction={attraction} />
        ))}
      </div>
    </div>
  );
};

export default AttractionsList;
