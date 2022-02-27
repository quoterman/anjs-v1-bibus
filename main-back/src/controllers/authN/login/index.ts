import {login} from "controllers/authN/login/handler";
import {AuthLoginBodySchema, AuthLoginResponsesSchema} from "controllers/authN/login/req-res";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";


export const initLogin = (
  app: FastifyInstance,
  privateKey: string,
  path: string = "/login"
) => {
  app.post<{
    Body: FromSchema<typeof AuthLoginBodySchema>;
  }>(
    path,
    {
      schema: {
        body: AuthLoginBodySchema,
        response: AuthLoginResponsesSchema,
      },
    },
    login(privateKey),
  )
}
