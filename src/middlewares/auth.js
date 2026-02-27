// import jwt from "jsonwebtoken";

// const publicRoutes = ["/auth/login", "/auth/register", "/payment/esewa/success", "/payment/esewa/failure", "/payments/webhook", "/payment/khalti/verify"];

// export const authMiddleware = (req, res, next) => {
//   if (publicRoutes.includes(req.path)) {
//     return next();
//   }
//   const [type, token] = req.headers.authorization?.split(" ") || [];
//   if (!token || type !== "Bearer") {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   req.user = decoded;
//   next();
// };




//code for http only cookie implementation

import jwt from "jsonwebtoken";

import Session from "../models/Session.js";

const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/payment/esewa/success",
  "/payment/esewa/failure",
  "/payments/webhook",
  "/payment/khalti/verify",
];

export const authMiddleware = async (req, res, next) => {
  if (
    publicRoutes.some((route) =>
      req.originalUrl.startsWith(route)
    )
  ) {
    return next();
  }

  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const session = await Session.findById(decoded.sessionId);

    if (!session || session.isValid === false) {
      return res.status(401).json({ message: "Session expired" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

