import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
    }
  }
}

function roleMiddleware(req: Request, res: Response, next: NextFunction): void {
  const role = req.headers["x-role"];
  req.isAdmin = role === "admin";
  next();
}

export default roleMiddleware;
