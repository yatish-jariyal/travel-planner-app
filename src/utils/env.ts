export const requireEnvironmentVariable = (
  name: string,
  value: unknown
): string => {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(
      `Missing required environment variable: ${name}. See docs/ENVIRONMENT_SETUP.md.`
    );
  }

  return value.trim();
};
