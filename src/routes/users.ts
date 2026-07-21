import { NextFunction, Response, Request } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middlewares/authMiddleware";

var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get(
  "/",
  authenticate,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        include: { blogs: true, role: true },
        omit: {
          password: true,
        },
      });
      res.send(users);
    } catch (error) {
      next(error);
    }
  },
);

// router.post(
//   "/",
//   async function (req: Request, res: Response, next: NextFunction) {
//     try {
//       const { name, email, password } = req.body;

//       const UserRole = await prisma.roles.findUnique({
//         where: { title: "user" },
//       });

//       if (!UserRole) {
//         throw new Error("User role not found");
//       }

//       const user = await prisma.user.create({
//         data: {
//           id: undefined,
//           name: name,
//           email: email,
//           roleId: UserRole.id,
//           password: password,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//  omit: {
//           password: true,
//         },
//       });
//       res.send(user);
//     } catch (error) {
//       next(error);
//     }
//   },
// );

router.put(
  "/:id",
  authenticate,
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

router.delete(
  "/:id",
  authenticate,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await prisma.user.delete({
        where: { id: String(id) },
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

module.exports = router;
