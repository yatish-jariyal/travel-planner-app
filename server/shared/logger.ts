type LogLevel = "info" | "error";

export const writeLog = (
  level: LogLevel,
  event: string,
  details: Record<string, unknown> = {}
) => {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details,
  });

  const stream = level === "error" ? process.stderr : process.stdout;
  stream.write(`${entry}\n`);
};
