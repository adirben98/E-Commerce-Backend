import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
interface AuthRequest extends Request {
  user?: {
    _id: string;
    isAdmin: boolean;
  };
}

export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization){
    res.status(401).json({ message: "Unauthorized" });

  }else{

    const token = req.headers.authorization!.replace("bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, data) => {
        if (err) {
          res.status(403).send(err);
        } else {
          const id = (data as JwtPayload).id;
          const isAdmin = (data as JwtPayload).isAdmin;
          req.user = {
            _id: id,
            isAdmin: isAdmin,
          };
          next();
        }
      });
    } catch (error) {
      res.status(403).json({ message: "Invalid token" });
    }
  }
}

export function verifyTokenAndAuthorization(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  verifyToken(req, res, () => {
    const userId = req.params.id;
    console.log(userId);
    console.log(req.user?._id);
    if (req.user?._id === userId || req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  });
}
export function verifyTokenAndAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  verifyToken(req, res, () => {
    const userId = req.params.id;

    if (req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  });
}
