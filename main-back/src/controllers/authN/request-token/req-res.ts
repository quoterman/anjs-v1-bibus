import {SuccessResponse} from "utils/json-schema";

export const AuthRequestTokenBodySchema = {
  title: "AuthRequestTokenBody Schema",
  type: "object",
  properties: {
    email: {
      type: "string",
      minLength: 1,
      description: "Email for registration",
    },
  },
  additionalProperties: false,
  required: [
    "email",
  ]
} as const;

export const AuthRequestTokenResponsesSchema = {
  ...SuccessResponse(),
} as const;
