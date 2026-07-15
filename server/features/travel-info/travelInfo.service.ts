import { geminiProviderError } from "./gemini/gemini.errors.js";
import type {
  AttractionImageService,
  TravelDataGenerator,
  TravelService,
} from "./travelInfo.types.js";

export const createTravelInfoService = (
  generator: TravelDataGenerator,
  images: AttractionImageService
): TravelService => ({
  async getTravelInfo(input) {
    let travelData;

    try {
      travelData = await generator.generate(input);
    } catch (error) {
      throw geminiProviderError(error);
    }

    return {
      ...travelData,
      attractions: await images.enrich(travelData.attractions),
    };
  },
});
