import express from "express";
import { body } from "express-validator";
import { login } from "../controllers/auth-controller";

const router = express.Router();

router.post(
  "/login",
  body("username").trim().not().isEmpty(),
  body("password").trim().isLength({ min: 4 }),
  login
);

export default router;