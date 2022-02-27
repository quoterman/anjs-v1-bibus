


export type SuccessResponse<R extends undefined | Record<any, any> = undefined> = R extends undefined ? {
  status: "success",
} : {
  status: "success",
  result: R
}

export type SuccessResponseP<R = undefined> = Promise<SuccessResponse<R>>

export type ErrorResponse<R> = {
  status: "error",
  error: R
}

export type Responses<R> = SuccessResponse<R> | ErrorResponse<R>
