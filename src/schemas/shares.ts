import { z } from 'zod';

// Схема для инструмента shares с поддержкой skip и limit
export const GetSharesParamsSchema = z.object({
  skip: z
    .number()
    .optional()
    .describe('Количество записей для пропуска (по умолчанию 0)'),
  limit: z
    .number()
    .optional()
    .describe(
      'Максимальное количество записей для возврата (по умолчанию 500, максимум 1000)',
    ),
});

export type GetSharesParams = z.infer<typeof GetSharesParamsSchema>;

// Схема для поиска акции по идентификатору
export const GetShareByParamsSchema = z.object({
  idType: z
    .enum([
      'INSTRUMENT_ID_TYPE_FIGI',
      'INSTRUMENT_ID_TYPE_TICKER',
      'INSTRUMENT_ID_TYPE_UID',
    ])
    .describe(
      'Тип идентификатора: INSTRUMENT_ID_TYPE_UID для instrumentUid из портфеля, INSTRUMENT_ID_TYPE_TICKER для тикера (например SBER), INSTRUMENT_ID_TYPE_FIGI для FIGI',
    ),
  id: z
    .string()
    .describe(
      'Идентификатор инструмента: instrumentUid, тикер или FIGI в зависимости от idType',
    ),
  classCode: z
    .string()
    .optional()
    .describe(
      'Код класса инструмента. Обязательный только для INSTRUMENT_ID_TYPE_TICKER',
    ),
});

export type GetShareByParams = z.infer<typeof GetShareByParamsSchema>;
