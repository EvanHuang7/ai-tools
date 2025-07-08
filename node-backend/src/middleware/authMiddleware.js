import { clerkClient, getAuth } from "@clerk/express";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing Bearer token" });
  }

  try {
    // Use `getAuth()` to get the user's `userId`
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No userId found" });
    }

    // Use Clerk's JavaScript Backend SDK to get the user's User object
    const user = await clerkClient.users.getUser(userId);

    // Attach full user info to the request object
    req.user = user;

    next();
  } catch (error) {
    console.error("Clerk auth error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
