import request from 'supertest'

import { App } from '../src/app'
import { boot } from '../src/main'

let application: App

beforeAll(async () => {
  const { app } = await boot
  application = app
})

describe('Users e2e', () => {
  it('Register - error', async () => {
    const res = await request(application.app)
      .post('/users/register')
      .send({ email: 'a@mail.com', password: 'qwerty' })

    expect(res.statusCode).toBe(422)
  })

  it('Login - success', async () => {
    const res = await request(application.app)
      .post('/users/login')
      .send({ email: 'a@mail.com', password: 'qwerty' })

    expect(res.body.jwt).not.toBeUndefined()
  })

  it('Login - error', async () => {
    const res = await request(application.app)
      .post('/users/login')
      .send({ email: 'a@mail.com', password: 'password' })

    expect(res.statusCode).toBe(401)
  })

  it('Info - success', async () => {
    const login = await request(application.app)
      .post('/users/login')
      .send({ email: 'a@mail.com', password: 'qwerty' })
    const res = await request(application.app)
      .get('/users/info')
      .set('Authorization', `Bearer ${login.body.jwt}`)

    expect(res.body.email).toBe('a@mail.com')
  })

  it('Info - error', async () => {
    const res = await request(application.app)
      .get('/users/info')
      .set('Authorization', `Bearer 1`)

    expect(res.statusCode).toBe(401)
  })
})

afterAll(() => {
  application.close()
})
