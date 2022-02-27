
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
