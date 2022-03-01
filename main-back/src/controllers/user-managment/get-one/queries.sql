/* @name FindUserById */
SELECT u.id, u.role, u."createdAt" as created_at, ue.value as email FROM public.user u
LEFT JOIN user_email ue ON ue."userId" = u.id
WHERE u.id = :userId AND ue.main = true;
