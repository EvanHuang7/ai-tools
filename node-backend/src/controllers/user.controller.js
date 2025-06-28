import { postgreDbClient } from "../lib/postgre.js";

export const getUser = async (req, res) => {
  try {
    // Get name and email from reqest body
    const { name, email } = req.body;

    const result = await postgreDbClient
      .insert(users)
      .values({ name, email })
      .returning();

    return res.status(200).json(result[0]);
  } catch (error) {
    console.log("Error in getUser controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
