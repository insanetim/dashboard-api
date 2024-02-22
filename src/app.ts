import express, { Express, json } from 'express'
import { Server } from 'http'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'

import { TYPES } from './types'
import { ILogger } from './logger/logger.interface'
import { UserController } from './users/users.controller'
import { IExeptionFilter } from './errors/exeption.filter.interface'
import { IConfigService } from './config/config.service.interface'

@injectable()
export class App {
  app: Express
  server: Server
  port: number

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.IUserController) private userController: UserController,
    @inject(TYPES.IExeptionFilter) private exeptionFilter: IExeptionFilter,
    @inject(TYPES.IConfigService) private configService: IConfigService,
  ) {
    this.app = express()
    this.port = 8000
  }

  useMiddleware(): void {
    this.app.use(json())
  }

  useRoutes(): void {
    this.app.use('/users', this.userController.router)
  }

  useExeptionFilters(): void {
    this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter))
  }

  public async init(): Promise<void> {
    this.useMiddleware()
    this.useRoutes()
    this.useExeptionFilters()
    this.server = this.app.listen(this.port, () => {
      this.logger.log(`Сервер запущен на http://localhost:${this.port}`)
    })
  }
}
