import {AuthLogoutResponsesSchema} from "controllers/authN/logout/req-res";
import {FastifyReply, FastifyRequest} from "fastify";
import {User} from "models/user";
import {SuccessResponseTypeP} from "utils/json-schema";


export const logout = () => async (request: FastifyRequest, reply: FastifyReply):SuccessResponseTypeP<typeof AuthLogoutResponsesSchema> => {
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
