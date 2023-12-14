import express from "express";
import { login, logout } from "../auth";

const router = express.Router();

router.post("/login", (req, res, next) => {
  login(req, req.body)
    .then((data) => {
      res.json({ data });
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/logout", (req, res) => {
  logout(req);

  res.json({ data: { message: "Success" } });
});

export default router;
