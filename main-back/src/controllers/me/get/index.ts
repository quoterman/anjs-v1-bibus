import {FastifyInstance, FastifyRequest} from "fastify";
import {User} from "models/user";


export const initGetMe = (
  app: FastifyInstance,
  path: string = "/"
) => {
  app.get(
    path,
    {},
    async (request: FastifyRequest): Promise<User> => {
      // . Check auth
      if (!request.userId) {
        throw new Error(`Permission denied`);
      }

      const user = await User.findOne({
        where: {
          id: request.userId
        }
      })

      if (!user) {
        throw new Error(`There is no user with this id`)
      }

      return user
    }
  )
}
