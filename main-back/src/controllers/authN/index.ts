import {config} from "config";
import {initLogin} from "controllers/authN/login";
import {initLogout} from "controllers/authN/logout";
import {initRegister} from "controllers/authN/register";
import {initRequestToken} from "controllers/authN/request-token";
import {emailSender} from "email-sender";
import {FastifyInstance} from "fastify";


export const initUnauthorizedAuthRoutes = (
  app: FastifyInstance,
  prefix: string = "/auth"
) => {
  app.register((authRoutes, opts, done) => {
    initRegister(authRoutes, emailSender)
    initLogin(authRoutes, config.jwtToken.secret)
    initRequestToken(authRoutes, emailSender)
    done()
  }, {
    prefix,
  })
}

export const initAuthorizedAuthRoutes = (
  app: FastifyInstance,
  prefix: string = "/auth"
) => {
  app.register((authRoutes, opts, done) => {
    initLogout(authRoutes)
    done()
  }, {
    prefix,
  })
}
