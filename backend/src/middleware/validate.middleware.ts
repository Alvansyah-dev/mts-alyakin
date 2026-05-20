// src/middleware/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validate = (schema: ZodType<any>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = await schema.parseAsync(req.body);
    return next();
  } catch (error) {
    return next(error);
  }
};
