import {findUserById} from "controllers/user-managment/get-one/queries.queries";
import {
  UserGetOneParamsSchema,
  UserGetOneResponsesSchema,
  UserGetOneResponsesSchemaOkResult
} from "controllers/user-managment/get-one/res-req";
import {FastifyInstance, FastifyRequest} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {Connection} from "typeorm";
import {SuccessResponse, SuccessResponseP} from "utils/responses";


export const initUserGetOne = (
  app: FastifyInstance,
  connection: Connection,
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
        // const user = await User.findOne({
        //   where: {
        //     id: request.params.id,
        //   }
        // })
        //
        // if (!user) {
        //   throw new Error(`There is no user with this id`)
        // }

        const [result] = await findUserById.run(
          {
            userId: request.params.id,
          },
          {
            query: async (query, params) => {
              return {
                rows: await connection.query(query, params)
              }
            },
          }
        )

        if (!result) {
          throw new Error(`Not found`)
        }

        return SuccessResponse.create<FromSchema<typeof UserGetOneResponsesSchemaOkResult>>(
          request.id,
          {
            ...result,
            created_at: result.created_at.toISOString(),
          },
        )
    }
  )
}
