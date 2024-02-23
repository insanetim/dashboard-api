import 'reflect-metadata'
import { Container, ContainerModule, interfaces } from 'inversify'

import { TYPES } from './types'
import { App } from './app'
import { IExeptionFilter } from './errors/exeption.filter.interface'
import { ExeptionFilter } from './errors/exeption.filter'
import { ILogger } from './logger/logger.interface'
import { LoggerService } from './logger/logger.service'
import { IUsersController } from './users/users.controller.interface'
import { UsersController } from './users/users.controller'
import { IUsersService } from './users/users.service.interface'
import { UsersService } from './users/users.service'
import { IConfigService } from './config/config.service.interface'
import { ConfigService } from './config/config.service'
import { PrismaService } from './database/prisma.service'
import { IUsersRepository } from './users/users.repository.interface'
import { UsersRepository } from './users/users.repository'

export interface IBootstrapReturn {
  appContainer: Container
  app: App
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope()
  bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter)
  bind<IUsersController>(TYPES.UsersController).to(UsersController)
  bind<IUsersService>(TYPES.UsersService).to(UsersService)
  bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope()
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope()
  bind<IUsersRepository>(TYPES.UsersRepository)
    .to(UsersRepository)
    .inSingletonScope()
  bind<App>(TYPES.Application).to(App)
})

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container()
  appContainer.load(appBindings)
  const app = appContainer.get<App>(TYPES.Application)
  await app.init()

  return { app, appContainer }
}

export const boot = bootstrap()
