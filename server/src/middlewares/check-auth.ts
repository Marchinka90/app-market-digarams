import path from "path";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { RequestHandler } from "express";
config({ path: path.resolve(__dirname, "../.env") });
import HttpError from "../models/http-error";

const JWT_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_KEY) {
  throw new Error("Missing necessary environment variables");
}

const CheckAuth: RequestHandler = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }

    const token = authHeader.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authorization failed!");
    }

    const decodedToken = jwt.verify(token, JWT_KEY) as { userId: string };
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(new HttpError("Authorization failed!", 401));
  }
};

export default CheckAuth;
