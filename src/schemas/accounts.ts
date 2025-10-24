import { z } from 'zod';

// Схема для инструмента accounts (без параметров)
export const GetAccountsParamsSchema = z.object({});

export type GetAccountsParams = z.infer<typeof GetAccountsParamsSchema>;
