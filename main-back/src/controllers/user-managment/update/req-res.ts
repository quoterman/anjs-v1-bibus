import {OkResponse} from "utils/json-schema";

export const UserUpdateBodySchema = {
  title: "UserUpdateBodySchema",
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 1,
      description: "User ID",
    },
    role: {
      type: "string",
      minLength: 1,
      description: "User role",
    },
  },
  additionalProperties: false,
  required: [
    "id",
    "role"
  ]
} as const;

export const UserUpdateResponsesSchema = {
  ...OkResponse(),
}
