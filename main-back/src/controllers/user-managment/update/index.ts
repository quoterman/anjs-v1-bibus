import {UserUpdateBodySchema, UserUpdateResponsesSchema} from "controllers/user-managment/update/req-res";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";
import {OkResponse} from "utils/json-schema";
import {SuccessResponse, SuccessResponseP} from "utils/responses";

export const initUpdateUser = (
  app: FastifyInstance,
  path: string = "/",
) => {
  app.put<{
    Body: FromSchema<typeof UserUpdateBodySchema>;
    Reply: FromSchema<typeof UserUpdateResponsesSchema["200"]>
  }>(
    path,
    {
      schema: {
        body: UserUpdateBodySchema,
        response: OkResponse(),
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

      const userData = Object.assign(new User(), request.body)

      await user.updateData(userData, requester)
      await user.save()

      return SuccessResponse.create(
        request.id,
      )
    }
  )
}
