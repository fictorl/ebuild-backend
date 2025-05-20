import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const isLojista = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return void res.sendStatus(401);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload.cnpj) return void res.sendStatus(403);
    (req as any).user = payload;
    next();
  } catch {
    return void res.sendStatus(403);
  }
};

export const isCliente = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return void res.sendStatus(401);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (!payload.id) return void res.sendStatus(403);
    (req as any).user = payload;
    next();
  } catch {
    return void res.sendStatus(403);
  }
};
