import {requestToken} from "controllers/authN/request-token/handler";
import {AuthRequestTokenBodySchema, AuthRequestTokenResponsesSchema} from "controllers/authN/request-token/req-res";
import {EmailSender} from "controllers/interfaces";
import {FastifyInstance} from "fastify";
import {FromSchema} from "json-schema-to-ts";


export const initRequestToken = (
  app: FastifyInstance,
  emailSender: EmailSender,
  path: string = "/request-token"
) => {
  app.post<{
    Body: FromSchema<typeof AuthRequestTokenBodySchema>;
    Reply: FromSchema<typeof AuthRequestTokenResponsesSchema["200"]>;
  }>(
    path,
    {
      schema: {
        body: AuthRequestTokenBodySchema,
        response: AuthRequestTokenResponsesSchema,
      },
    },
    requestToken(emailSender),
  )
}
