import {EmailSender} from "controllers/interfaces";
import {
  ChangeUserEmailBodySchema,
  ChangeUserEmailResponsesSchema
} from "controllers/user-managment/change-email/req-res";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";
import {SuccessResponse, SuccessResponseP} from "utils/responses";

export const initChangeUserEmailHandler = (
  app: FastifyInstance,
  emailSender: EmailSender,
  path: string = "/",
) => {
  app.post<{
    Body: FromSchema<typeof ChangeUserEmailBodySchema>;
    Reply: FromSchema<typeof ChangeUserEmailResponsesSchema["200"]>
  }>(
    path,
    {
      schema: {
        body: ChangeUserEmailBodySchema,
        response: ChangeUserEmailResponsesSchema,
      },
    },
    async (request): SuccessResponseP => {
      const user = await User.findOne({
        where: {
          id: request.body.id,
        }
      })

      if (!user) {
        throw new Error(`Not found`)
      }

      const requester = await User.findOne({
        where: {
          id: request.userId,
        }
      })

      if (!requester) {
        throw new Error(`Not found`)
      }

      await user.changeActiveEmail(request.body.email, requester)
      await user.save()

      return SuccessResponse.create(
        request.id,
      )
    }
  )
}
