import type { AxiosInstance } from "axios";
import type { ServerConfig } from "../../../config.js";
import type {
  Attraction,
  AttractionImage,
} from "../travelInfo.types.js";

interface ImageSearchResponse {
  items?: Array<{ link?: string; image?: { contextLink?: string } }>;
}

export const findGoogleAttractionImage = async (
  attraction: Attraction,
  config: ServerConfig,
  client: AxiosInstance
): Promise<AttractionImage | null> => {
  const { apiKey, searchEngineId } = config.googleSearch;
  if (!apiKey || !searchEngineId) return null;

  const response = await client.get<ImageSearchResponse>(
    "https://www.googleapis.com/customsearch/v1",
    {
      headers: { "x-goog-api-key": apiKey },
      params: {
        q: `${attraction.attractionName} ${attraction.location}`,
        cx: searchEngineId,
        searchType: "image",
      },
    }
  );
  const item = response.data.items?.[0];

  if (!item?.link) return null;

  return {
    imageUrl: item.link,
    imageSourceName: item.image?.contextLink ? "Web source" : undefined,
    imageSourceUrl: item.image?.contextLink,
  };
};
