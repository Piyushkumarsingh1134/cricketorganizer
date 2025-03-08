import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "your_secret_key"; 

const getOrganizerId = (req: Request, res: Response, next: NextFunction):void => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Unauthorized: No token provided" });
      return ;
    }

 
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    if (!decoded?.id) {
       res.status(401).json({ error: "Unauthorized: Invalid token" });
       return;
    }

    (req as any).organizerId = decoded.id;  

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return ;
  }
};

export default getOrganizerId;

  
