import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";



export const requireLogin = async (req, res, next) => {

    console.log(  "req.body"  , req.body)

  const authHeader = req.headers.authorization;

  console.log( "authHeader"  , authHeader);

  const token = authHeader.split(" ")[1];

  console.log(  "token"  , token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token required." });
  }

  try {
    const decoded = jwt.verify(token, "fuybiug890");

    const userId = decoded._id;

    const user = await User.findById(userId);

    if (user === null || !user) {
      return res.status(404).json({ error: "User not found." });
    }

    // res.status(200).json({ error: "User Authorized" })

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token" });
  }
};