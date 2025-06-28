import { postgreDbClient } from "../lib/postgre.js";
import { users } from "../db/schema.js";

export const getUser = async (req, res) => {
  try {
    // Get text and momentId from reqest body
    const { id } = req.body;

    const result = await postgreDbClient.select(id).from(users);
    const user = result[0];

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUser controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    // Get name and email from reqest body
    const { name, email } = req.body;

    const result = await postgreDbClient
      .insert(users)
      .values({ name, email })
      .returning();
    const newUser = result[0];

    return res.status(201).json(newUser);
  } catch (error) {
    console.log("Error in createUser controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
