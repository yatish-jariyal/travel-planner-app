import type { AxiosInstance } from "axios";
import type {
  Attraction,
  AttractionImage,
} from "../travelInfo.types.js";

interface WikipediaImageResponse {
  query?: {
    pages?: Array<{
      title?: string;
      thumbnail?: { source?: string };
    }>;
  };
}

export const findWikipediaAttractionImage = async (
  attraction: Attraction,
  client: AxiosInstance
): Promise<AttractionImage | null> => {
  const response = await client.get<WikipediaImageResponse>(
    "https://en.wikipedia.org/w/api.php",
    {
      headers: {
        "User-Agent":
          "travel-planner-app/0.0.0 (https://github.com/yatish-jariyal/travel-planner-app)",
      },
      params: {
        action: "query",
        format: "json",
        formatversion: "2",
        generator: "search",
        gsrsearch: `${attraction.attractionName} ${attraction.location}`,
        gsrnamespace: "0",
        gsrlimit: "5",
        prop: "pageimages",
        piprop: "thumbnail",
        pithumbsize: "800",
        pilicense: "free",
      },
    }
  );
  const page = response.data.query?.pages?.find(
    (candidate) => candidate.thumbnail?.source && candidate.title
  );

  if (!page?.thumbnail?.source || !page.title) return null;

  return {
    imageUrl: page.thumbnail.source,
    imageSourceName: "Wikipedia",
    imageSourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(
      page.title.replace(/ /g, "_")
    )}`,
  };
};
