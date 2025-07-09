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
