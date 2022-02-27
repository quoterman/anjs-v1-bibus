import {UserGetOneParamsSchema} from "controllers/user-managment/get-one/res-req";
import {FastifyInstance, FastifyRequest} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";


export const initUserGetOne = (
  app: FastifyInstance,
  path: string = "/:id"
) => {
  app.get<{
    Params: FromSchema<typeof UserGetOneParamsSchema>;
  }>(
    path,
    {
      schema: {
        params: UserGetOneParamsSchema,
      },
    },
    async (request: FastifyRequest<{Params: FromSchema<typeof UserGetOneParamsSchema>}>): Promise<User> => {
        const user = await User.findOne({
          where: {
            id: request.params.id,
          }
        })

        if (!user) {
        throw new Error(`There is no user with this id`)
      }

      return user
    }
  )
}
