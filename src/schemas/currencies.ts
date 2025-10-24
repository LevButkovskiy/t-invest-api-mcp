import { z } from 'zod';

// Zod схема для валидации параметров инструмента getCurrencies
export const GetCurrenciesParamsSchema = z.object({
  limit: z
    .number()
    .min(1)
    .max(1000)
    .optional()
    .describe(
      'Максимальное количество инструментов для возврата (по умолчанию 500)',
    ),
  skip: z
    .number()
    .min(0)
    .optional()
    .describe('Количество инструментов для пропуска (по умолчанию 0)'),
});

export type GetCurrenciesParams = z.infer<typeof GetCurrenciesParamsSchema>;

// Zod схема для валидации параметров инструмента getCurrencyBy
export const GetCurrencyByParamsSchema = z.object({
  id: z
    .string()
    .min(1)
    .describe('Идентификатор инструмента (FIGI, тикер или UID)'),
  idType: z
    .enum([
      'INSTRUMENT_ID_TYPE_FIGI',
      'INSTRUMENT_ID_TYPE_TICKER',
      'INSTRUMENT_ID_TYPE_UID',
    ])
    .describe('Тип идентификатора инструмента'),
  classCode: z.string().optional().describe('Код класса инструмента'),
});

export type GetCurrencyByParams = z.infer<typeof GetCurrencyByParamsSchema>;
