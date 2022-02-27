import {AuthRequestTokenBodySchema, AuthRequestTokenResponsesSchema} from "controllers/authN/request-token/req-res";
import {EmailSender} from "controllers/interfaces";
import {FastifyReply, FastifyRequest} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {UserEmail} from "models/user-email";
import {SuccessResponseTypeP} from "utils/json-schema";

export const requestToken = (
  emailSender: EmailSender,
) =>
  async (request: FastifyRequest<{Body: FromSchema<typeof AuthRequestTokenBodySchema>}>, reply: FastifyReply): SuccessResponseTypeP<typeof AuthRequestTokenResponsesSchema> => {
  // . Get user email for token
  const userEmail = await UserEmail.findOne({
    where: {
      main: true,
      value: request.body.email,
    },
    relations: ["user"]
  })

  if (!userEmail) {
    return {
      status: "success"
    }
  }

  const user = userEmail.user

  // . Create new token
  await user.createNewToken()

  // . Get this last token
  const token = await user.lastTempToken()

  if (!token) {
    throw new Error(`There is no token`)
  }

  // . Send email with token
  await emailSender.sendEmail(`Your token is ${token.id}`, user.mainEmail().value)

  // . Success
  return {
    status: "success"
  }
}
