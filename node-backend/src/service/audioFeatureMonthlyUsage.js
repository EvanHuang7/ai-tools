// service/audioFeatureUsage.js
import { eq, and } from "drizzle-orm";
import { postgreDbClient } from "../lib/postgre.js";
import { audioFeatureMonthlyUsage } from "../db/schema.js";
import { getCurrentYearAndMonthStart } from "../utils/date.js";

/**
 * Get user's audio feature usage for the current month.
 * @param {string} userId
 * @returns {Promise<number>} usage count (0 if no record)
 */
export async function getAudioFeatureMonthlyUsage(userId) {
  const monthStart = getCurrentYearAndMonthStart();

  try {
    const result = await postgreDbClient
      .select()
      .from(audioFeatureMonthlyUsage)
      .where(
        and(
          eq(audioFeatureMonthlyUsage.userId, userId),
          eq(audioFeatureMonthlyUsage.monthAndYear, monthStart)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return 0; // no usage record
    }

    return result[0].usage;
  } catch (err) {
    console.error("Failed to fetch audio usage:", err);
    throw err;
  }
}
