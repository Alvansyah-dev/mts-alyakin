// src/utils/response.ts
import { Response } from 'express';

export const success = (res: Response, data: any, message?: string, status: number = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const error = (res: Response, message: string, status: number = 400, details?: any) => {
  return res.status(status).json({
    success: false,
    message,
    details,
  });
};
