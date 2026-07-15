import { format } from "date-fns";

export const formatDuration = (durationMinutes: number) => {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m` : ""}`.trim();
};

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM d, h:mm a");
  } catch {
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

export const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
