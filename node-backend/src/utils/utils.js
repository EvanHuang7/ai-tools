import fs from "fs";

// Read the secret from file Only if creating a docker secret within Docker Swarm
export function getEnvOrFile(key, defaultValue = "") {
  const envValue = process.env[key];
  if (envValue) return envValue;

  const filePath = process.env[`${key}_FILE`];
  // "fs.existsSync(filePath)" checks if a file exists at the given path
  if (filePath && fs.existsSync(filePath)) {
    try {
      return fs.readFileSync(filePath, "utf8").trim();
    } catch (err) {
      console.error(`Failed to read file for ${key}:`, err.message);
    }
  }

  return defaultValue;
}

// Get the current year and month start (1st day of the month at midnight)
export function getCurrentYearAndMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}
