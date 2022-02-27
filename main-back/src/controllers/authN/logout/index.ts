import {logout} from "controllers/authN/logout/handler";
import {AuthLogoutResponsesSchema} from "controllers/authN/logout/req-res";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";


export const initLogout = (
  app: FastifyInstance,
  path: string = "/logout"
) => {
  app.post<{
    Reply: FromSchema<typeof AuthLogoutResponsesSchema["200"]>
  }>(
    path,
    {
      schema: {
        response: AuthLogoutResponsesSchema,
      },
    },
    logout(),
  )
}
