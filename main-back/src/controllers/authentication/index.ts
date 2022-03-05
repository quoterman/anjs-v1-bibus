import {initRegisterHandler} from "controllers/authentication/register";
import {initRequestToken} from "controllers/authentication/request-token";
import {emailSender} from "email-sender";
import {FastifyInstance} from "fastify";


export const initAuthDomainRoutes = (
  app: FastifyInstance,
  prefix: string = "/auth"
) => {
  app.register((authRoutes, opts, done) => {
    initRegisterHandler(
      authRoutes,
      emailSender,
      "/register",
      "post"
    )
    initRequestToken(
      authRoutes,
      emailSender,
    )

    // authRoutes.post<{
    //   Body: FromSchema<typeof AuthLoginBodySchema>;
    //   // Reply: AuthRegisterResponsesSchema;
    // }>(
    //   "/login",
    //   {
    //     schema: {
    //       body: AuthLoginBodySchema,
    //       response: AuthLoginResponsesSchema,
    //     },
    //   },
    //   async (request, reply) => {
    //     return authController.login(
    //       request,
    //     )
    //   })

    done()
  }, {
    prefix,
  })
}
