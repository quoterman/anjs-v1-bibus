export const AuthRegisterBodySchema = {
  title: "AuthRegisterBody Schema",
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

export const AuthRequestTokenBodySchema = {
  title: "AuthRegisterBody Schema",
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

export const AuthLoginBodySchema = {
  title: "AuthRegisterBody Schema",
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


export const AuthRegisterResponsesSchema = {
  "200": {
    title: "Success",
    type: "object",
    required: ["status"],
    properties: {
      status: {
        const: "success",
        type: "string",
        description: "Successful operation status",
        example: "success",
      },
    },
    additionalProperties: false,
  }
} as const;

export const AuthRequestTokenResponsesSchema = {
  "200": {
    title: "Success",
    type: "object",
    required: ["status"],
    properties: {
      status: {
        const: "success",
        type: "string",
        description: "Successful operation status",
        example: "success",
      },
    },
    additionalProperties: false,
  }
} as const;

export const AuthLogoutResponsesSchema = {
  "200": {
    title: "Success",
    type: "object",
    required: ["status"],
    properties: {
      status: {
        const: "success",
        type: "string",
        description: "Successful operation status",
        example: "success",
      },
    },
    additionalProperties: false,
  }
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
