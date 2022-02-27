import {initUserGetOne} from "controllers/user/get-one";
import {initUserList} from "controllers/user/list";
import {initUpdateUser} from "controllers/user/update";
import {FastifyInstance} from "fastify";


export const initUserHandlers = (
  app: FastifyInstance,
) => {
  app.register((userRoutes, opts, done) => {
    // UPDATE USER
    initUpdateUser(userRoutes)

    // GET USERS LIST
    initUserList(userRoutes)

    // GET USER BY ID
    initUserGetOne(userRoutes)
    done()
  }, {
    prefix: "/user"
  })
}
