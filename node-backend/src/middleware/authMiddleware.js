import { clerkClient, getAuth } from "@clerk/express";
import jwt from "jsonwebtoken"; // built-in JWT decode

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing Bearer token" });
  }

  try {
    // Get userId
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No userId found" });
    }

    // Get full user info object
    const user = await clerkClient.users.getUser(userId);

    // Decode token to get V2 JWT claims
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded !== "object") {
      return res.status(400).json({ error: "Failed to decode token" });
    }

    // Extract user plan like "pro_user" from "u:pro_user"
    const rawPlan = decoded.pla;
    let userPlan = null;
    if (typeof rawPlan === "string" && rawPlan.startsWith("u:")) {
      // eg. "pro_user"
      userPlan = rawPlan.split(":")[1];
    }
    if (!userPlan) {
      return res.status(400).json({ error: "User plan not found in JWT" });
    }

    // Attach userId, full user info and userPlan to the request object
    req.userId = userId;
    req.user = user;
    req.userPlan = userPlan;

    next();
  } catch (error) {
    console.error("Clerk auth error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
