// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      admin?: any;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  console.log('Auth header:', authHeader)
  
  const token = authHeader?.split(' ')[1]
  console.log('Token:', token ? token.substring(0, 20) + '...' : 'undefined')
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token tidak ditemukan' 
    })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    console.log('Decoded:', decoded)
    req.admin = decoded
    next()
  } catch (error: any) {
    console.log('JWT Error:', error.message)
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)
    return res.status(401).json({ 
      success: false, 
      message: 'Token tidak valid' 
    })
  }
};
