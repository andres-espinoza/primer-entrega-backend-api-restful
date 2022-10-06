// eslint-disable-next-line @typescript-eslint/no-redeclare
import { NextFunction, Request, Response } from 'express';

const profileChecker = () => (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_IS_ADMIN) next();
  else
    res.send({ error: -1, description: `route ${req.originalUrl}, ${req.method} method, not authorized` });
};

export default profileChecker;
