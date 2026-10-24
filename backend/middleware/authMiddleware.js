
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer "))
      {
      return res.status(401).json({
        message: "Access denied. Please login first"
      });
        }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

      if (!user)
      {
      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action"
      });
    }

    next();
  };
};

export { protect, authorize };
