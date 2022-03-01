import {initChangeUserEmailHandler} from "controllers/user-managment/change-email";
import {initUserGetOne} from "controllers/user-managment/get-one";
import {initUserList} from "controllers/user-managment/list";
import {initUpdateUser} from "controllers/user-managment/update";
import {emailSender} from "email-sender";
import {FastifyInstance} from "fastify";
import {Connection} from "typeorm";


export const initUserHandlers = (
  app: FastifyInstance,
  connection: Connection,
) => {
  app.register((userRoutes, opts, done) => {
    // UPDATE USER
    initUpdateUser(userRoutes)

    // GET USERS LIST
    initUserList(userRoutes)

    // GET USER BY ID
    initUserGetOne(userRoutes, connection)

    // CHANGE EMAIL
    initChangeUserEmailHandler(
      userRoutes,
      emailSender
    )
    done()
  }, {
    prefix: "/user"
  })
}
