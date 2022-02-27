import {register} from "controllers/authN/register/handler";
import {AuthRegisterBodySchema, AuthRegisterResponsesSchema} from "controllers/authN/register/req-res";
import {EmailSender} from "controllers/interfaces";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";


export const initRegister = (
  app: FastifyInstance,
  emailSender: EmailSender,
  path: string = "/register"
) => {
  app.post<{
    Body: FromSchema<typeof AuthRegisterBodySchema>;
  }>(
    path,
    {
      schema: {
        body: AuthRegisterBodySchema,
        response: AuthRegisterResponsesSchema,
      },
    },
    register(emailSender),
  )
}
