import { postgreDbClient } from "../lib/postgre.js";
import { audios } from "../db/schema.js";
import {
  getAudioFeatureMonthlyUsage,
  incrementAudioFeatureMonthlyUsage,
} from "../service/audioFeatureMonthlyUsage.js";
import {
  freeUserAudioFeatureMonthlyLimit,
  standardUserAudioFeatureMonthlyLimit,
  proUserAudioFeatureMonthlyLimit,
} from "../utils/constants.js";

export const startAudio = async (req, res) => {
  try {
    // Get Clerk userId and userPlan from req after auth middleware
    const userId = req.userId;
    const userPlan = req.userPlan;

    // Step 1: Check current usage
    const currentMonthlyUsage = await getAudioFeatureMonthlyUsage(userId);

    // Step 2: Determine plan limit
    let monthlyLimit = 0;
    switch (userPlan) {
      case "free_user":
        monthlyLimit = freeUserAudioFeatureMonthlyLimit;
        break;
      case "standard_user":
        monthlyLimit = standardUserAudioFeatureMonthlyLimit;
        break;
      case "pro_user":
        monthlyLimit = proUserAudioFeatureMonthlyLimit;
        break;
      default:
        monthlyLimit = 0;
    }

    // Step 3: Reject if over limit
    if (currentMonthlyUsage >= monthlyLimit) {
      return res.status(429).json({
        error:
          "You've exceeded your monthly audio feature usage limit. Please upgrade your plan to continue.",
      });
    }

    return res.status(200).json({
      message: "Audio monthly usage check passed",
    });
  } catch (error) {
    console.log("Error in startAudio controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
