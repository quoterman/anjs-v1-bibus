import {
  GetUserQueryQueryStringSchema,
  GetUserQueryResponses
} from "controllers/get-user/req-res";
import {knexConnection} from "database";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {QueryResult} from "pg";
import {
  UserEmailTableColumnNames, UserEmailTableName,
  UserEmailTableValue,
  UserTableColumnNames,
  UserTableCreatedAt,
  UserTableId, UserTableName,
  UserTableRole
} from "utils/introspect-it-schema";
import {SuccessResponse} from "utils/responses";


export const initGetUser = (
  app: FastifyInstance,
  path: string = "/:id"
) => {
  app.get<{
    Params: FromSchema<typeof GetUserQueryQueryStringSchema>,
    Reply: FromSchema<typeof GetUserQueryResponses["200"]>
  }>(
    path,
    {
      schema: {
        params: GetUserQueryQueryStringSchema,
        response: GetUserQueryResponses
      }
    },
    async (request) => {
      // // ORM
      // const result = await User.findOne({
      //   where: {
      //     id: request.params.id,
      //   },
      // })
      //
      // if (!result) {
      //   throw new Error(`No user`)
      // }
      //
      // const user = {
      //   id: result.id,
      //   email: result.mainEmail().value,
      //   role: result.role,
      //   registration_date: result.createdAt,
      // }

      // // ORM READ MODEL (not working)
      // const user = await GetUserReadModel.findOne({
      //   where: {
      //     id: request.params.id,
      //   },
      // })

      // // QUERYBUILDER + INTROSPECTION
      // const userTableAlias = "u"
      // const userEmailTableAlias = "ue"
      // const registrationDateColumnName = "registration_date"
      // const emailDateColumnName = "email"
      // const query = knexConnection
      //   .select(
      //     `${userTableAlias}.${UserTableColumnNames.id}`,
      //     `${userTableAlias}.${UserTableColumnNames.role}`,
      //     `${userTableAlias}.${UserTableColumnNames.createdAt} as ${registrationDateColumnName}`,
      //     `${userEmailTableAlias}.${UserEmailTableColumnNames.value} as ${emailDateColumnName}`,
      //   )
      //   .from(`public.${UserTableName} as ${userTableAlias}`)
      //   .leftJoin(
      //     `${UserEmailTableName} as ${userEmailTableAlias}`,
      //     `${userEmailTableAlias}.${UserEmailTableColumnNames.userId}`,
      //     `${userTableAlias}.${UserTableColumnNames.id}`
      //   )
      //   .where({
      //     [`${userTableAlias}.${UserTableColumnNames.id}`]: request.params.id,
      //     [`${userEmailTableAlias}.${UserEmailTableColumnNames.main}`]: true,
      //   })
      //   .limit(1)
      //
      // const result: Array<{
      //   id: UserTableId,
      //   role: UserTableRole,
      //   registration_date: UserTableCreatedAt,
      //   email: UserEmailTableValue,
      // }> = await query
      //
      // const user = result[0]

      // RAW SQL + INTROSPECTION
      const userTableAlias = "u"
      const userEmailTableAlias = "ue"
      const registrationDateColumnName = "registration_date"
      const emailDateColumnName = "email"
      const result = await knexConnection.raw<QueryResult<{
        id: UserTableId,
        role: UserTableRole,
        registration_date: UserTableCreatedAt,
        email: UserEmailTableValue,
      }>>(`
        SELECT
          ${userTableAlias}.${UserTableColumnNames.id},
          ${userTableAlias}.${UserTableColumnNames.role},
          ${userTableAlias}."${UserTableColumnNames.createdAt}" as ${registrationDateColumnName},
          ${userEmailTableAlias}.${UserEmailTableColumnNames.value} as ${emailDateColumnName}
        FROM public.${UserTableName} ${userTableAlias}
        LEFT JOIN ${UserEmailTableName} ${userEmailTableAlias} ON ${userEmailTableAlias}."${UserEmailTableColumnNames.userId}" = ${userTableAlias}.${UserTableColumnNames.id}
        WHERE ${userTableAlias}.${UserTableColumnNames.id} = ? AND ${userEmailTableAlias}.${UserEmailTableColumnNames.main} = true;
      `, [request.params.id])

      const user = result.rows[0]

      if (!user) {
        throw new Error(`There is no user with this id`)
      }

      return SuccessResponse.create(request.id, {
        id: user.id,
        email: user.email,
        role: user.role,
        "registration-date": user.registration_date.toISOString(),
      })
    }
  )
}
