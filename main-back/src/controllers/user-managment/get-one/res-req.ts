import {OkResponse} from "utils/json-schema";

export const UserGetOneParamsSchema = {
  title: "UserGetOneParamsSchema",
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 1,
      description: "User ID",
    },
  },
  additionalProperties: false,
  required: [
    "id",
  ]
} as const;

export const UserGetOneResponsesSchemaOkResult = {
  type: "object",
  required: ["id", "role", "created_at", "email"],
  properties: {
    id: {
      type: "string",
    },
    role: {
      type: "string",
    },
    created_at: {
      type: "string",
    },
    email: {
      type: "string",
    },
  },
  additionalProperties: false,
} as const

export const UserGetOneResponsesSchema = {
  ...OkResponse(UserGetOneResponsesSchemaOkResult),
}
