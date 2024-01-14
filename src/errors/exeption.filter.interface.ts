import { Request, Response, NextFunction } from 'express'

import { HTTPError } from './http-error.class'

export interface IExeptionFilter {
  catch: (
    err: Error | HTTPError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void
}
