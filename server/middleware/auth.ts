import { Request, Response, NextFunction } from "express";

// Extend Express Request to include user session
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    session: {
      userId?: string;
      destroy(callback: (err: any) => void): void;
    };
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Please log in to access this resource",
    });
  }

  // Add userId to request for easy access in route handlers
  req.userId = req.session.userId;
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    req.userId = req.session.userId;
  }
  next();
}
