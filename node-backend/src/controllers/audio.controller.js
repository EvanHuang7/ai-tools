import { postgreDbClient } from "../lib/postgre.js";
// import { uploadAudioToGCS } from "../lib/gcsClient.js";
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
      return res.status(200).json({
        passUsageCheck: false,
        message:
          "You've exceeded your monthly audio feature usage limit. Please upgrade your plan to continue.",
      });
    }

    return res.status(200).json({
      passUsageCheck: true,
      message: "Audio monthly usage check passed",
    });
  } catch (error) {
    console.log("Error in startAudio controller", error.message);
    return res.status(500).json({
      passUsageCheck: false,
      message: "Interal server error",
    });
  }
};

export const createAudio = async (req, res) => {
  try {
    // Get Clerk userId and userPlan from req after auth middleware
    const userId = req.userId;

    // Get topic and transcript from reqest body
    const { topic, transcript } = req.body;

    // Input check
    if (!topic || !transcript) {
      return res.status(400).json({ message: "Missing topic or transcript" });
    }

    // Comment: Decode audio base64 and Upload audio to GCS bucket
    // DEPRECATED logic bc AI Vapi voice cann't be recorded:
    // const base64Regex = /^data:audio\/\w+;base64,/;
    // const audioBuffer = base64Regex.test(audio)
    //   ? Buffer.from(audio.replace(base64Regex, ""), "base64")
    //   : Buffer.from(audio, "base64");
    // const audioUrl = await uploadAudioToGCS(audioBuffer);

    // Create db record
    const result = await postgreDbClient
      .insert(audios)
      .values({ userId, topic, transcript })
      .returning();

    // increase audio monthly usage for user
    await incrementAudioFeatureMonthlyUsage(userId);

    const newAudio = result[0];
    return res.status(201).json(newAudio);
  } catch (error) {
    console.log("Error in createAudio controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

export const listAudios = async (req, res) => {
  try {
    // Get Clerk userId and userPlan from req after auth middleware
    const userId = req.userId;

    const allAudios = await postgreDbClient.select(userId).from(audios);

    return res.status(200).json(allAudios);
  } catch (error) {
    console.log("Error in listAudios controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
