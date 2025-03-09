import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import AuthConfig from "../config/auth.config";
import AppError from "../utils/app-error";

interface CustomRequest extends Request {
  user?: any;
}

const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next(new AppError(401, "fail", "No token provided"));

  jwt.verify(token, AuthConfig.TOKEN_KEY as string, (error, decoded) => {
    if (error)
      return next(new AppError(401, "fail", "Failed to authenticate token"));

    req.user = decoded;
    next();
  });
};

export { verifyToken };
