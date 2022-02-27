import {UserUpdateBodySchema} from "controllers/user/update/req-res";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";

export const initUpdateUser = (
  app: FastifyInstance,
  path: string = "/",
) => {
  app.put<{
    Body: FromSchema<typeof UserUpdateBodySchema>;
  }>(
    path,
    {
      schema: {
        body: UserUpdateBodySchema,
      },
    },
    async (request): Promise<User> => {
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

      return user
    }
  )
}
