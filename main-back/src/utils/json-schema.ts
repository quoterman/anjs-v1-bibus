import {FromSchema} from "json-schema-to-ts";


export type SuccessResponseType<T extends {"200": any}> = FromSchema<T["200"]>
export type SuccessResponseTypeP<T extends {"200": any}> = Promise<SuccessResponseType<T>>

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
