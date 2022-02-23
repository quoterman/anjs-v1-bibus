

export const UserGetOneQuerySchema = {
  title: "UserGetOneQuerySchema",
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
