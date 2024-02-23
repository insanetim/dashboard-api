import 'reflect-metadata'
import { UserModel } from '@prisma/client'
import { Container } from 'inversify'

import { TYPES } from '../types'
import { IConfigService } from '../config/config.service.interface'
import { IUsersRepository } from './users.repository.interface'
import { IUsersService } from './users.service.interface'
import { UsersService } from './users.service'
import { User } from './user.entity'

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
}

const UsersRepositoryMock: IUsersRepository = {
  find: jest.fn(),
  create: jest.fn(),
}

const container = new Container()
let configService: IConfigService
let usersRepository: IUsersRepository
let usersService: IUsersService

beforeAll(() => {
  container.bind<IUsersService>(TYPES.UsersService).to(UsersService)
  container
    .bind<IConfigService>(TYPES.ConfigService)
    .toConstantValue(ConfigServiceMock)
  container
    .bind<IUsersRepository>(TYPES.UsersRepository)
    .toConstantValue(UsersRepositoryMock)

  configService = container.get<IConfigService>(TYPES.ConfigService)
  usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository)
  usersService = container.get<IUsersService>(TYPES.UsersService)
})

let createdUser: UserModel | null

describe('User Service', () => {
  it('createUser', async () => {
    configService.get = jest.fn().mockReturnValueOnce('1')
    usersRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        id: 1,
        email: user.email,
        name: user.name,
        password: user.password,
      }),
    )
    createdUser = await usersService.createUser({
      email: 'a@mail.com',
      name: 'Johnny',
      password: 'qwerty',
    })

    expect(createdUser?.id).toBe(1)
    expect(createdUser?.password).not.toBe('qwerty')
  })

  it('validateUser - success', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser)
    const result = await usersService.validateUser({
      email: 'a@mail.com',
      password: 'qwerty',
    })

    expect(result).toBe(true)
  })

  it('validateUser - wrong password', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser)
    const result = await usersService.validateUser({
      email: 'a@mail.com',
      password: 'password',
    })

    expect(result).toBe(false)
  })

  it('validateUser - wrong user', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(null)
    const result = await usersService.validateUser({
      email: 'user@mail.com',
      password: 'password',
    })

    expect(result).toBe(false)
  })
})
