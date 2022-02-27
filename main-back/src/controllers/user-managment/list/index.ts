import {FastifyInstance} from "fastify";
import {User} from "models/user";


export const initUserList = (
  app: FastifyInstance,
  path: string = "/"
) => {
  app.get(
    path,
    {
      schema: {},
    },
    async (): Promise<User[]> => {
      return await User.find()
    }
  )
}
