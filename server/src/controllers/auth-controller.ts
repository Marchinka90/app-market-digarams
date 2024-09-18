import path from "path";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config({ path: path.resolve(__dirname, "../.env") });

import User from "../models/user";
import HttpError from "../models/http-error";

const JWT_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_KEY) {
  throw new Error("Missing necessary environment variables");
}

export const login: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { username, password, rememberMe } = req.body as {
    username: string;
    password: string;
    rememberMe: boolean;
  };

  let existingUser;
  try {
    existingUser = await User.findOne({ username });
  } catch (err) {
    return next(
      new HttpError("Logging in faild, please try again later.", 500)
    );
  }

  if (!existingUser) {
    return next(
      new HttpError(
        "Could not identify a user, credentials seem to be wrong.",
        401
      )
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError(
        "Logging in faild, please check your credentials and try again.",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, username: existingUser.username },
      JWT_KEY,
      { expiresIn: rememberMe ? "1d" : "1h" }
    );
  } catch {
    return next(new HttpError("Logged in faild, please try again later.", 500));
  }

  res.status(201).json({ token });
};

export const autoSignin = async () => {
  const username = "test";
  const password = "test";

  let existingUser;
  try {
    existingUser = await User.findOne({ username });
  } catch {
    throw new Error("Auto signing test user faild");
  }

  if (!existingUser) {
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
      throw new Error("Auto signing test user faild");
    }

    const createdUser = new User({
      username,
      password: hashedPassword,
    });

    try {
      await createdUser.save();
    } catch {
      throw new Error("Auto signing test user faild");
    }
  }
};
