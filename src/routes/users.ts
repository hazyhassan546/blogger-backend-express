import { NextFunction, Response, Request } from "express";
import prisma from "../lib/prisma";

var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        include: { blogs: true },
      });
      res.send(users);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const user = await prisma.user.create({
        data: {
          id: undefined,
          name: name,
          email: email,
          password: password,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      res.send(user);
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;
      const user = await prisma.user.update({
        where: { id: String(id) },
        data: {
          name: name,
          email: email,
          password: password,
          updatedAt: new Date(),
        },
      });
      res.send(user);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await prisma.user.delete({
        where: { id: String(id) },
      });
      res.send(user);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
