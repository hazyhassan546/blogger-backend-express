import { NextFunction, Response, Request } from "express";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import {
  generateAuthToken,
  generateRefreshToken,
} from "../lib/helperFunctions";

var express = require("express");
var router = express.Router();

router.post(
  "/register",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      const UserRole = await prisma.roles.findUnique({
        where: { title: "user" },
      });

      if (!UserRole) {
        throw new Error("User role not found");
      }

      const hashedPassword = await argon2.hash(password);

      const user = await prisma.user.create({
        data: {
          id: undefined,
          name: name,
          email: email,
          roleId: UserRole.id,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        omit: {
          password: true,
        },
      });
      res.send(user);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/login",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email: email },
        include: { role: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await argon2.verify(user.password, password);

      if (!isMatch) {
        throw new Error("Invalid password");
      }

      // Generate JWT
      const token = generateAuthToken(user);
      const refresh_token = generateRefreshToken(user);

      res.send({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        access_token: token,
        refresh_token: refresh_token,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/refresh-token",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      const old_token = authHeader.split(" ")[1];
      const decoded = jwt.verify(old_token, process.env.JWT_REFRESH_SECRET);
      const userId = decoded.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });

      if (!user) {
        throw new Error("Invalid or expired token");
      }

      // Generate JWT
      const token = generateAuthToken(user);
      const refresh_token = generateRefreshToken(user);

      res.send({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        access_token: token,
        refresh_token: refresh_token,
      });
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  },
);

module.exports = router;
