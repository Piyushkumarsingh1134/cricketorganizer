import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "your_secret_key"; 

interface AuthRequest extends Request {
  organizerId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return; 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    console.log("Decoded Token:", decoded); 

    req.organizerId = decoded.id; 
    next(); 
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};