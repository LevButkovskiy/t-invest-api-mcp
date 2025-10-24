import { z } from 'zod';

// Схема для инструмента shares с поддержкой skip и limit
export const GetSharesParamsSchema = z.object({
  skip: z.number().optional().describe('Количество записей для пропуска'),
  limit: z
    .number()
    .optional()
    .describe(
      'Максимальное количество записей для возврата (по умолчанию 500)',
    ),
});

export type GetSharesParams = z.infer<typeof GetSharesParamsSchema>;

// Схема для поиска акции по идентификатору
export const GetShareByParamsSchema = z.object({
  idType: z.enum(['INSTRUMENT_ID_TYPE_FIGI', 'INSTRUMENT_ID_TYPE_TICKER', 'INSTRUMENT_ID_TYPE_UID']).describe('Тип идентификатора инструмента'),
  id: z.string().describe('Идентификатор запрашиваемого инструмента'),
  classCode: z.string().optional().describe('Идентификатор class_code. Обязательный, если idType = INSTRUMENT_ID_TYPE_TICKER'),
});

export type GetShareByParams = z.infer<typeof GetShareByParamsSchema>;
