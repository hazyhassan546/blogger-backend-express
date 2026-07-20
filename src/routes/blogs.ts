import { NextFunction, Response, Request } from "express";
import prisma from "../lib/prisma";
import { BLOGS_STATUSES } from "../common/constants";

var express = require("express");
var router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await prisma.blogs.findMany({
      include: {},
    });
    res.send(blogs);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, authorId } = req.body;
      const user = await prisma.blogs.create({
        data: {
          id: undefined,
          title: title,
          description: description,
          status: BLOGS_STATUSES.DRAFT,
          authorId: authorId,
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
      const { title, description } = req.body;
      const user = await prisma.blogs.update({
        where: {
          id: String(req.params.id),
        },
        data: {
          title: title,
          description: description,
          status: BLOGS_STATUSES.DRAFT,
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
      const user = await prisma.blogs.delete({
        where: { id: String(id) },
      });
      res.send(user);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
