import { Request, Response, NextFunction } from 'express'

export interface IUsersController {
  login: (req: Request, res: Response, next: NextFunction) => Promise<void>
  register: (req: Request, res: Response, next: NextFunction) => Promise<void>
  info: (req: Request, res: Response, next: NextFunction) => Promise<void>
}
