import { Container, ContainerModule, interfaces } from 'inversify'

import { TYPES } from './types'
import { App } from './app'
import { IExeptionFilter } from './errors/exeption.filter.interface'
import { ExeptionFilter } from './errors/exeption.filter'
import { ILogger } from './logger/logger.interface'
import { LoggerService } from './logger/logger.service'
import { IUserController } from './users/users.controller.interface'
import { UserController } from './users/users.controller'

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<App>(TYPES.Application).to(App)
  bind<ILogger>(TYPES.ILogger).to(LoggerService)
  bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionFilter)
  bind<IUserController>(TYPES.UserController).to(UserController)
})

function bootstrap() {
  const appContainer = new Container()
  appContainer.load(appBindings)
  const app = appContainer.get<App>(TYPES.Application)
  app.init()

  return { app, appContainer }
}

export const { app, appContainer } = bootstrap()
