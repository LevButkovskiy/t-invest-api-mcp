import { z } from 'zod';

// Схема для инструмента userInfo (без параметров)
export const GetUserInfoParamsSchema = z.object({});

export type GetUserInfoParams = z.infer<typeof GetUserInfoParamsSchema>;
