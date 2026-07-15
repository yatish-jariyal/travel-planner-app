import type { Attraction } from "../../../../shared/api/contracts";
import AttractionCard from "./AttractionCard";
import EmptyAttractionsList from "./EmptyAttractionsList";

interface AttractionsListProps {
  attractions: Attraction[];
}

const AttractionsList = ({ attractions }: AttractionsListProps) => {
  if (attractions.length === 0) {
    return <EmptyAttractionsList />;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Popular Attractions</h2>

      <div className="mb-4">
        <span className="text-sm text-gray-600">
          {attractions.length} attractions found
        </span>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {attractions.map((attraction) => (
          <AttractionCard
            key={`${attraction.attractionName}-${attraction.location}`}
            attraction={attraction}
          />
        ))}
      </div>
    </div>
  );
};

export default AttractionsList;
