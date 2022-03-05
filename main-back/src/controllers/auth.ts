import {AuthLoginBodySchema} from "controllers/auth.req-res";
import {EmailSender} from "controllers/authentication/email-sender";
import { FastifyRequest} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {TempToken} from "models/temp-token";
import {User} from "models/user";
import pino from "pino";
import {JWTToken} from "utils/jwt-tokens";
import {SuccessResponse, SuccessResponseR, SuccessResponseWR} from "utils/responses";

export class AuthController {
  constructor(
    private logger: pino.Logger,
    private emailSender: EmailSender,
    private privateKey: string,
  ) {}

  async login(request: FastifyRequest<{Body: FromSchema<typeof AuthLoginBodySchema>}>): Promise<SuccessResponseR<{token: string}>> {
    // . Get temp token with user
    const tempToken = await TempToken.findOne({
      where: {
        id: request.body.tempToken,
        used: false,
        userEmail: {
          value: request.body.email,
          main: true,
        }
      },
      relations: [
        "userEmail",
        "userEmail.user"
      ]
    })

    if (!tempToken) {
      throw new Error(`There is no unused token with id ${request.body.tempToken}`)
    }

    // . Login
    const user = tempToken.userEmail.user
    await user.loginByTempToken(tempToken)
    await user.save()

    // . Create JWT for User
    const jwtToken = user.lastJwtToken()

    if (!jwtToken) {
      throw new Error(`No JWT Token`)
    }

    // . Send JWT
    return SuccessResponse.create(request.id, {
      token: JWTToken.sign(this.privateKey, {
        id: jwtToken.id,
        userId: user.id,
        userEmail: user.mainEmail().value,
      }),
    })
  }

  async logout(request: FastifyRequest): Promise<SuccessResponseWR> {
    // . Check auth
    if (!request.userId) {
      throw new Error(`Permission denied`);
    }

    // . Get User
    const user = await User.findOne({
      where: {
        id: request.userId,
      }
    })

    if (!user) {
      throw new Error(`User must be`)
    }

    // . Logout
    await user.logout()

    // . Success
    return SuccessResponse.create(request.id)
  }
}
