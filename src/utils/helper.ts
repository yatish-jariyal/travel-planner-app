import { format } from "date-fns";

export const formatDuration = (duration: string) => {
  const hours = duration.match(/(\d+)H/);
  const minutes = duration.match(/(\d+)M/);
  return `${hours ? hours[1] + "h " : ""}${
    minutes ? minutes[1] + "m" : ""
  }`.trim();
};

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM d, h:mm a");
  } catch (e) {
    console.log(e);
    return dateString;
  }
};

export const getCabinDisplay = (cabin: string) => {
  const cabinMap: Record<string, string> = {
    ECONOMY: "Economy",
    PREMIUM_ECONOMY: "Premium Economy",
    BUSINESS: "Business",
    FIRST: "First",
  };
  return cabinMap[cabin] || cabin;
};
