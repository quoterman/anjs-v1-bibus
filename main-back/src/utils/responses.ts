

export type SuccessResponseWR = {
  reqId: string
  status: "success",
}

export type SuccessResponseR<R extends Record<any, any>> = {
  reqId: string
  status: "success",
  result: R
}

export type SuccessResponse<R extends undefined | Record<any, any> = undefined> = R extends Record<any, any> ? SuccessResponseR<R> : SuccessResponseWR

export type SuccessResponseP<R = undefined> = Promise<SuccessResponse<R>>

function create(reqId: string): SuccessResponseWR
function create<R extends Record<any, any>>(reqId: string, result: R): SuccessResponseR<R>
function create<R extends Record<any, any> | undefined>(reqId: string, result?: R) {
  if (result === undefined) {
    return {
      status: "success",
      reqId,
    }
  } else {
    return {
      status: "success",
      reqId,
      result,
    }
  }
}

export const SuccessResponse = {
  create,
}

export type ErrorResponse<R> = {
  reqId: string
  status: "error",
  error: R
}

export const ErrorResponse = {
  create: <R>(reqId: string, error: R): ErrorResponse<R> => {
    return {
      reqId,
      status: "error",
      error,
    }
  }
}

export type Responses<R> = SuccessResponse<R> | ErrorResponse<R>
