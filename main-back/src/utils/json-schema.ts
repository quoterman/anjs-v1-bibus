

export const SuccessResponse = (title: string = "Success") => ({
  "200": {
    title,
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
}) as const;
