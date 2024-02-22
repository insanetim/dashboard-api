import { inject, injectable } from 'inversify'
import 'reflect-metadata'

import { TYPES } from '../types'
import { UserLoginDto } from './dto/user-login.dto'
import { UserRegisterDto } from './dto/user-register.dto'
import { User } from './user.entity'
import { IUserService } from './users.service.interface'
import { IConfigService } from '../config/config.service.interface'

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IConfigService) private configService: IConfigService,
  ) {}

  async createUser({
    email,
    name,
    password,
  }: UserRegisterDto): Promise<User | null> {
    const newUser = new User(email, name)
    const salt = this.configService.get('SALT')
    await newUser.setPassword(password, Number(salt))
    return null
  }

  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
    return true
  }
}
