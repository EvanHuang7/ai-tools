// service/audioFeatureUsage.js
import { eq, and } from "drizzle-orm";
import { postgreDbClient } from "../lib/postgreClient.js";
import { audioFeatureMonthlyUsage } from "../db/schema.js";
import { getCurrentYearAndMonthStart } from "../utils/utils.js";

/**
 * Get user's audio feature usage for the current month.
 * @param {string} userId
 * @returns {Promise<number>} usage count (0 if no record)
 */
export async function getAudioFeatureMonthlyUsage(userId) {
  const monthStart = getCurrentYearAndMonthStart();

  try {
    // Check current usage record
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

    // If no record found or get data query errors, return 0
    if (result.length === 0) {
      return 0;
    }

    return result[0].usage;
  } catch (err) {
    console.error("Failed to fetch audio usage:", err);
    throw err;
  }
}

/**
 * Increment user’s audio feature usage this month or create a new record.
 * @param {string} userId - The Clerk user ID
 * @param {number} count - How much to increment (default 1)
 */
export async function incrementAudioFeatureMonthlyUsage(userId, count = 1) {
  const monthStart = getCurrentYearAndMonthStart();

  try {
    // Check current usage record
    const existing = await postgreDbClient
      .select()
      .from(audioFeatureMonthlyUsage)
      .where(
        and(
          eq(audioFeatureMonthlyUsage.userId, userId),
          eq(audioFeatureMonthlyUsage.monthAndYear, monthStart)
        )
      )
      .limit(1);

    // Increment usage if exist
    if (existing.length > 0) {
      const usage = existing[0].usage + count;

      await postgreDbClient
        .update(audioFeatureMonthlyUsage)
        .set({
          usage,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(audioFeatureMonthlyUsage.userId, userId),
            eq(audioFeatureMonthlyUsage.monthAndYear, monthStart)
          )
        );
    } else {
      // Create a record if not exist
      await postgreDbClient.insert(audioFeatureMonthlyUsage).values({
        userId,
        usage: count,
        monthAndYear: monthStart,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (err) {
    console.error("Failed to increment audio feature usage:", err);
    throw err;
  }
}
