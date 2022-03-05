import {GetUserQueryQueryStringSchema, GetUserQueryResponses} from "controllers/get-user/req-res";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";
import {SuccessResponse} from "utils/responses";


export const initGetUser = (
  app: FastifyInstance,
  path: string = "/"
) => {
  app.get<{
    Params: FromSchema<typeof GetUserQueryQueryStringSchema>,
    Reply: FromSchema<typeof GetUserQueryResponses["200"]>
  }>(
    path,
    {
      schema: {
        querystring: GetUserQueryQueryStringSchema,
        response: GetUserQueryResponses
      }
    },
    async (request) => {
      const user = await User.findOne({
        where: {
          id: request.params.id,
        }
      })

      if (!user) {
        throw new Error(`There is no user with this id`)
      }

      return SuccessResponse.create(request.id, {
        "id": user.id,
        "role": user.role,
        "email": user.mainEmail().value,
        "registration-date": user.createdAt.toISOString(),
      })
    }
  )
}
