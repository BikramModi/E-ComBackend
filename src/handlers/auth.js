// import Router from "express";
// import useValidator from "../middlewares/useValidator.js";
// import { register, login } from "../services/auth.js";
// import { createUserValidator } from "../validators/user.js";
// import { loginValidator } from "../validators/auth.js";

// const AUTH_ROUTER = Router();

// AUTH_ROUTER.post(
//   "/register",
//   useValidator(createUserValidator),
//   async (req, res, next) => {
//     try {
//       const result = await register(req.body);
//       res.status(201).json(result);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// AUTH_ROUTER.post(
//   "/login",
//   useValidator(loginValidator),
//   async (req, res, next) => {
//     try {
//       const result = await login(req.body);
//       res.status(200).json(result);
//     } catch (error) {
//       next(error);
//     }
//   }
// );



// export default AUTH_ROUTER;




//code for http only cookie implementation

import Router from "express";
import useValidator from "../middlewares/useValidator.js";
import { register, login } from "../services/auth.js";
import { createUserValidator } from "../validators/user.js";
import { loginValidator } from "../validators/auth.js";

import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Session from "../models/Session.js";

const AUTH_ROUTER = Router();

AUTH_ROUTER.post(
  "/register",
  useValidator(createUserValidator),
  async (req, res, next) => {
    try {
      const result = await register(req.body, res); // Pass res to set cookie
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

AUTH_ROUTER.post(
  "/login",
  useValidator(loginValidator),
  async (req, res, next) => {
    try {
      const result = await login(req.body, res, req); // Pass res and req to set cookie
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

AUTH_ROUTER.post("/logout", async (req, res) => {


  const token = req.cookies.accessToken;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  await Session.findByIdAndUpdate(decoded.sessionId, {
    isValid: false,
  });


  res.clearCookie("accessToken");
  res.json({ message: "Logged out" });
});

AUTH_ROUTER.get("/me", async (req, res) => {
  try {
    const token = req.cookies.accessToken; // HTTP-only cookie
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});




export default AUTH_ROUTER;