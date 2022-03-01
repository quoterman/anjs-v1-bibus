/** Types generated for queries found in "src/controllers/user-managment/get-one/queries.sql" */
import { PreparedQuery } from '@pgtyped/query';

export type user_role_enum = 'admin' | 'user';

/** 'FindUserById' parameters type */
export interface IFindUserByIdParams {
  userId: string | null | void;
}

/** 'FindUserById' return type */
export interface IFindUserByIdResult {
  created_at: Date;
  email: string;
  id: string;
  role: user_role_enum;
}

/** 'FindUserById' query type */
export interface IFindUserByIdQuery {
  params: IFindUserByIdParams;
  result: IFindUserByIdResult;
}

const findUserByIdIR: any = {"name":"FindUserById", "params":[{"name":"userId", "required":false, "transform":{"type":"scalar"}, "codeRefs":{"used":[{"a":172, "b":177, "line":4, "col":14}]}}], "usedParamSet":{"userId":true}, "statement":{"body":"SELECT u.id, u.role, u.\"createdAt\" as created_at, ue.value as email FROM public.user u\nLEFT JOIN user_email ue ON ue.\"userId\" = u.id\nWHERE u.id = :userId AND ue.main = true", "loc":{"a":25, "b":196, "line":2, "col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT u.id, u.role, u."createdAt" as created_at, ue.value as email FROM public.user u
 * LEFT JOIN user_email ue ON ue."userId" = u.id
 * WHERE u.id = :userId AND ue.main = true
 * ```
 */
export const findUserById = new PreparedQuery<IFindUserByIdParams, IFindUserByIdResult>(findUserByIdIR);


