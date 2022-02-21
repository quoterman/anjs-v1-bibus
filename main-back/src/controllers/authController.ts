import {AuthLoginBodySchema, AuthRegisterBodySchema, AuthRequestTokenBodySchema} from "controllers/auth.req-res";
import {FastifyReply, FastifyRequest} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";
import {UserEmail} from "models/user-email";
import pino from "pino";
import {JWTToken} from "utils/jwt-tokens";

type EmailSender = {
  sendEmail: (message: string, email: string) => Promise<void>
}

export class AuthController {
  constructor(
    private logger: pino.Logger,
    private emailSender: EmailSender,
    private privateKey: string,
  ) {}

  async register(request: FastifyRequest<{Body: FromSchema<typeof AuthRegisterBodySchema>}>, reply: FastifyReply) {
    // . Check email
    if (await UserEmail.checkEmailExist(request.body.email)) {
      throw new Error(`User with email ${request.body.email} already exist`)
    }

    // . Create new user, email and passwordless token
    const user = await User.registerUser(request.body.email)
    await user.save()

    // . Send token to email
    const token = user.lastTempToken()
    const email = user.mainEmail()

    if (!token || !email) {
      throw new Error("Something went wrong")
    }

    await this.emailSender.sendEmail(`Your token is ${token.id}`, email.value)

    // . Return User
    reply.status(200).send({
      status: "success"
    })
  }

  async requestToken(request: FastifyRequest<{Body: FromSchema<typeof AuthRequestTokenBodySchema>}>, reply: FastifyReply) {
    const user = await User.findOne({
      where: {
        emails: {
          main: true,
          value: request.body.email,
        }
      }
    })

    if (!user) {
      reply.status(200).send({
        reply: "OK"
      })

      return
    }

    await user.createNewToken()

    const token = user.lastTempToken()

    if (!token) {
      throw new Error(`There is no token`)
    }

    await this.emailSender.sendEmail(`Your token is ${token.id}`, user.mainEmail().value)

    reply.status(200).send({
      reply: "OK"
    })
  }

  async login(request: FastifyRequest<{Body: FromSchema<typeof AuthLoginBodySchema>}>, reply: FastifyReply) {
    // ! TELL ABOUT LOGIC FROM TEMP TOKEN

    const user = await User.findOne({
      where: {
        emails: {
          value: request.body.email,
          main: true,
          tempTokens: {
            id: request.body.tempToken,
            used: false
          }
        }
      }
    })

    if (!user) {
      throw new Error(`There is no token with id ${request.body.tempToken}`)
    }

    const tempToken = user.tokenById(request.body.tempToken)

    if (!tempToken) {
      throw new Error(``)
    }

    await user.loginByTempToken(tempToken)
    await user.save()

    // . Get token and create new for user
    const jwtToken = user.lastJwtToken()

    if (!jwtToken) {
      throw new Error(`...`)
    }

    const token: JWTToken = {
      id: jwtToken.id,
      userId: user.id,
      identityEmail: user.mainEmail().value,
    }

    reply.status(200).send({
      token: JWTToken.sign(this.privateKey, token),
    })
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    if (!request.userId) {
      throw new Error(`Permission denied`);
    }

    const user = await User.findOne({
      where: {
        id: request.userId,
      }
    })

    if (!user) {
      throw new Error(`User must be`)
    }

    await user.logout()

    reply.status(200).send({
      reply: "OK"
    })
  }
}
