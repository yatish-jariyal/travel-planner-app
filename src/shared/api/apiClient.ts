import axios from "axios";

interface ApiErrorResponse {
  error?: { message?: string };
}

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const apiClient = axios.create({
  baseURL: configuredBaseUrl || "",
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

export const getApiErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.error?.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};
