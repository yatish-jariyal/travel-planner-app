import type { AxiosInstance } from "axios";
import type { ServerConfig } from "../../../config.js";
import type {
  Attraction,
  AttractionImage,
  AttractionImageService,
} from "../travelInfo.types.js";
import { findGoogleAttractionImage } from "./googleSearch.client.js";
import { findWikipediaAttractionImage } from "./wikipedia.client.js";

const findAttractionImage = async (
  attraction: Attraction,
  config: ServerConfig,
  client: AxiosInstance
): Promise<AttractionImage> => {
  if (config.googleSearch.apiKey && config.googleSearch.searchEngineId) {
    try {
      const googleImage = await findGoogleAttractionImage(
        attraction,
        config,
        client
      );
      if (googleImage) return googleImage;
    } catch {
      // Continue to the key-free Wikipedia fallback.
    }
  }

  try {
    const wikipediaImage = await findWikipediaAttractionImage(
      attraction,
      client
    );
    if (wikipediaImage) return wikipediaImage;
  } catch {
    // Images are optional; travel suggestions should still be returned.
  }

  return { imageUrl: "" };
};

export const createAttractionImageService = (
  config: ServerConfig,
  client: AxiosInstance
): AttractionImageService => ({
  async enrich(attractions) {
    return Promise.all(
      attractions.map(async (attraction) => ({
        ...attraction,
        ...(await findAttractionImage(attraction, config, client)),
      }))
    );
  },
});
