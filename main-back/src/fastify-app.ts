import {config} from "config";
import {
  AuthLoginBodySchema,
  AuthLoginResponsesSchema, AuthLogoutResponsesSchema,
  AuthRegisterBodySchema,
  AuthRegisterResponsesSchema, AuthRequestTokenBodySchema, AuthRequestTokenResponsesSchema
} from "controllers/auth.req-res";
import {AuthController} from "controllers/authController";
import {emailSender} from "email-sender";
import Fastify, { FastifyInstance } from "fastify";
import fastifySwagger from "fastify-swagger";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";
import {JWTToken} from "utils/jwt-tokens";
import {v4} from "uuid";

import {logger} from "../logger";

export const app: FastifyInstance = Fastify({
  logger: config.logger.active && logger,
  genReqId: () => v4(),
});

// . SWAGGER
if (config.http.swagger.active) {
  app.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: "/documentation",
    openapi: {
      info: {
        title: "nearpay-ninjas",
        version: "1",
      },
    },
  });
}

// . SCHEMA
app.addSchema({
  $id: "authSchema",
  type: "object",
  properties: {
    Authorization: {
      type: "string",
      description:
        "Authorization header (ex. `Authorization: Bearer ${token}`)",
    },
  },
});

// . AUTH
app.decorateRequest("userId", "");

// . ROUTER
// . AUTHENTICATED
app.register(async (childServer) => {
  childServer.addHook("onRequest", async (request) => {
    if (
      request.url.includes("documentation") ||
      request.url.includes("health")
    ) {
      return;
    }

    const headerToken = request.headers.authorization;

    if (!headerToken) {
      throw new Error(`Permission denied`);
    }

    const token = headerToken.split("Bearer ")[1];

    if (!token) {
      throw new Error(`Permission denied`);
    }

    // const user = await NinjasUserTable(knex)
    //   .where({ authToken: token })
    //   .first();

    const decoded = JWTToken.verify(config.jwtToken.secret, token)

    const user = await User.findOne({
      where: {
        id: decoded.userId,
      },
    })

    if (!user) {
      throw new Error(`Permission denied`);
    }

    // eslint-disable-next-line require-atomic-updates
    request.userId = user.id;
  });

  // . AUTH PREFIX
  childServer.register((authRoutes) => {
    const authController = new AuthController(
      logger,
      emailSender,
      config.jwtToken.secret,
    )

    authRoutes.post<{
      Body: FromSchema<typeof AuthRegisterBodySchema>;
      // Reply: AuthRegisterResponsesSchema;
    }>(
      "/register",
      {
        schema: {
          body: AuthRegisterBodySchema,
          response: AuthRegisterResponsesSchema,
        },
      },
      async (request, reply) => {
        return authController.register(
          request,
          reply
        )
      })

    authRoutes.post<{
      Body: FromSchema<typeof AuthLoginBodySchema>;
      // Reply: AuthRegisterResponsesSchema;
    }>(
      "/login",
      {
        schema: {
          body: AuthLoginBodySchema,
          response: AuthLoginResponsesSchema,
        },
      },
      async (request, reply) => {
        return authController.login(
          request,
          reply
        )
      })

    authRoutes.post<{
      Body: FromSchema<typeof AuthRequestTokenBodySchema>;
      // Reply: AuthRequestTokenResponsesSchema;
    }>(
      "/request-token",
      {
        schema: {
          body: AuthRequestTokenBodySchema,
          response: AuthRequestTokenResponsesSchema,
        },
      },
      async (request, reply) => {
        return authController.requestToken(
          request,
          reply
        )
      })

    authRoutes.post<{
      // Reply: AuthLogoutResponsesSchema;
    }>(
      "/logout",
      {
        schema: {
          response: AuthLogoutResponsesSchema,
        },
      },
      async (request, reply) => {
        return authController.logout(
          request,
          reply
        )
      })

  }, {
    prefix: "/auth"
  })

})
