import {logout} from "controllers/authN/logout/handler";
import {AuthLogoutResponsesSchema} from "controllers/authN/logout/req-res";
import {FastifyInstance} from "fastify";


export const initLogout = (
  app: FastifyInstance,
  path: string = "/logout"
) => {
  app.post(
    path,
    {
      schema: {
        response: AuthLogoutResponsesSchema,
      },
    },
    logout(),
  )
}
