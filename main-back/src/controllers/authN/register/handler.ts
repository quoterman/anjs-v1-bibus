import {AuthRegisterBodySchema} from "controllers/authN/register/req-res";
import {EmailSender} from "controllers/interfaces";
import {FastifyReply, FastifyRequest} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";
import {UserEmail} from "models/user-email";


export const register = (
  emailSender: EmailSender,
) =>
  async (request: FastifyRequest<{Body: FromSchema<typeof AuthRegisterBodySchema>}>, reply: FastifyReply) => {
  // . Check email
  if (await UserEmail.checkEmailExist(request.body.email)) {
    throw new Error(`User with email ${request.body.email} already exist`)
  }

  // . Create new user, email and passwordless token
  const user = await User.registerUser(request.body.email)
  await user.save()

  // . Send token to email
  const token = await user.lastTempToken()
  const email = user.mainEmail()

  if (!token || !email) {
    throw new Error("Something went wrong")
  }

  await emailSender.sendEmail(`Your token is ${token.id}`, email.value)

  // . Return User
  reply.status(200).send({
    status: "success"
  })
}
