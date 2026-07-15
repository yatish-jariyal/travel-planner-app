import type { Attraction } from "../../../../shared/api/contracts";

interface AttractionCardProps {
  attraction: Attraction;
}

const AttractionCard = ({ attraction }: AttractionCardProps) => {
  const {
    attractionName,
    description,
    location,
    entryFee,
    ratings,
    imageUrl,
    imageSourceName,
    imageSourceUrl,
  } = attraction;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={attractionName}
          className="h-40 w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className="flex h-40 items-center justify-center bg-gray-200 text-sm text-gray-600"
          role="img"
          aria-label={`No image available for ${attractionName}`}
        >
          Image unavailable
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{attractionName}</h3>
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">
            {ratings} ★
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-1">{location}</p>
        <p className="text-sm mt-2 line-clamp-2">{description}</p>

        {imageSourceName && imageSourceUrl && (
          <a
            href={imageSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-xs text-blue-700 underline"
          >
            Image source: {imageSourceName}
          </a>
        )}

        <div className="mt-3 border-t pt-3">
          <span className="font-medium">{entryFee}</span>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
