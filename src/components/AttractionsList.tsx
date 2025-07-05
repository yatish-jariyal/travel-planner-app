import { Attraction } from "../redux/travelSlice";
import AttractionCard from "./AttractionCard";

// Attractions list component

interface AttractionsListProps {
  attractions: Attraction[];
}

const AttractionsList: React.FC<AttractionsListProps> = ({ attractions }) => {
  // Handle different states
  if (!attractions) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading attractions...</span>
      </div>
    );
  }

  if (attractions.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <h3 className="font-medium">No attractions found</h3>
        <p className="text-sm text-gray-600 mt-1">
          Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  // Display the list of attractions
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

      {/* Attractions grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {attractions.map((attraction, index) => (
          <AttractionCard key={index} attraction={attraction} />
        ))}
      </div>
    </div>
  );
};

export default AttractionsList;
