import {FastifyReply, FastifyRequest} from "fastify";
import {User} from "models/user";
import {SuccessResponseP} from "utils/responses";


export const logout = () => async (request: FastifyRequest, reply: FastifyReply): SuccessResponseP => {
  // . Check auth
  if (!request.userId) {
    throw new Error(`Permission denied`);
  }

  // . Get User
  const user = await User.findOne({
    where: {
      id: request.userId,
    }
  })

  if (!user) {
    throw new Error(`User must be`)
  }

  // . Logout
  await user.logout()

  // . Success
  return {
    status: "success"
  }
}
