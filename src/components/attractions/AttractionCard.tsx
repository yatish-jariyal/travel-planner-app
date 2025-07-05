import { Attraction } from "../../redux/travelSlice";

interface AttractionCardProps {
  attraction: Attraction;
}

const AttractionCard = ({ attraction }: AttractionCardProps) => {
  const { attractionName, description, location, entryFee, ratings, imageUrl } =
    attraction;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Can add an image here */}
      {imageUrl && <img src={imageUrl} alt="image" />}
      <div className="h-40 bg-gray-200"></div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{attractionName}</h3>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">
            {ratings} ★
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-1">{location}</p>
        <p className="text-sm mt-2 line-clamp-2">{description}</p>

        <div className="mt-3 pt-3 border-t flex justify-between items-center">
          <span className="font-medium">{entryFee}</span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
