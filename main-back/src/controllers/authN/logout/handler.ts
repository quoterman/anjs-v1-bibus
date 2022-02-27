import {AuthLogoutResponsesSchema} from "controllers/authN/logout/req-res";
import {FastifyReply, FastifyRequest} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {User} from "models/user";


export const logout = () => async (request: FastifyRequest, reply: FastifyReply): Promise<FromSchema<typeof AuthLogoutResponsesSchema["200"]>> => {
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
