import {OkResponse} from "utils/json-schema";

export const ChangeUserEmailBodySchema = {
  title: "ChangeUserEmailBodySchema",
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 1,
      description: "User ID",
    },
    email: {
      type: "string",
      minLength: 1,
      description: "User email",
    },
  },
  additionalProperties: false,
  required: [
    "id",
    "email"
  ]
} as const;

export const ChangeUserEmailResponsesSchema = {
  ...OkResponse(),
}
