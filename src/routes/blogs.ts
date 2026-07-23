import { NextFunction, Response, Request } from "express";
import prisma from "../lib/prisma";
import { BLOGS_STATUSES } from "../common/constants";
import { authenticate } from "../middlewares/authMiddleware";

var express = require("express");
var router = express.Router();

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await prisma.blogs.findMany({
        include: {},
      });
      res.send(blogs);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/published",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogs = await prisma.blogs.findMany({
        where: {
          status: "published",
        },
        include: {},
      });
      res.send(blogs);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  authenticate,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const blog = await prisma.blogs.create({
        data: {
          id: undefined,
          title: title,
          description: description,
          status: BLOGS_STATUSES.DRAFT,
          authorId: req.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      res.send(blog);
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/:id",
  authenticate,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description } = req.body;
      const blog = await prisma.blogs.update({
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
      res.send(blog);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  authenticate,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const blog = await prisma.blogs.delete({
        where: { id: String(id) },
      });
      res.send(blog);
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  "/updateStatus/:id",
  authenticate,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const newStatus = BLOGS_STATUSES[String(status).toUpperCase()];
      if (!newStatus) {
        throw new Error("Status not found");
      }

      const blog = await prisma.blogs.update({
        where: { id: String(id) },
        data: {
          status: newStatus,
          updatedAt: new Date(),
        },
      });
      res.send(blog);
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
