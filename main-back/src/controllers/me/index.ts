import {initGetMe} from "controllers/me/get";
import {FastifyInstance} from "fastify";


export const initMeHandlers = (
  app: FastifyInstance,
) => {
  initGetMe(
    app,
    "/me"
  )
}
