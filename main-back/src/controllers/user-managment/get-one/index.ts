import {
  UserGetOneParamsSchema,
  UserGetOneResponsesSchema,
  UserGetOneResponsesSchemaOkResult
} from "controllers/user-managment/get-one/res-req";
import {FastifyInstance, FastifyRequest} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";
import {SuccessResponse, SuccessResponseP} from "utils/responses";


export const initUserGetOne = (
  app: FastifyInstance,
  path: string = "/:id"
) => {
  app.get<{
    Params: FromSchema<typeof UserGetOneParamsSchema>;
    Reply: FromSchema<typeof UserGetOneResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        params: UserGetOneParamsSchema,
      },
    },
    async (request: FastifyRequest<{Params: FromSchema<typeof UserGetOneParamsSchema>}>): SuccessResponseP<FromSchema<typeof UserGetOneResponsesSchemaOkResult>> => {
        const user = await User.findOne({
          where: {
            id: request.params.id,
          }
        })

        if (!user) {
          throw new Error(`There is no user with this id`)
        }

        return SuccessResponse.create<FromSchema<typeof UserGetOneResponsesSchemaOkResult>>(
          request.id,
          {
            id: user.id,
            role: user.role,
            created_at: user.createdAt.toISOString(),
            email: user.mainEmail().value,
          }
        )
    }
  )
}
