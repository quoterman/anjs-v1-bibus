
export const AuthLoginBodySchema = {
  title: "AuthLoginBody Schema",
  type: "object",
  properties: {
    email: {
      type: "string",
      minLength: 1,
      description: "Email for registration",
    },
    tempToken: {
      type: "string",
      minLength: 1,
      description: "Email for registration",
    },
  },
  additionalProperties: false,
  required: [
    "email",
    "tempToken"
  ]
} as const;

export const AuthLoginResponsesSchema = {
  "200": {
    title: "Success",
    type: "object",
    required: ["token"],
    properties: {
      token: {
        type: "string",
        description: "Token",
      },
    },
    additionalProperties: false,
  }
} as const;
