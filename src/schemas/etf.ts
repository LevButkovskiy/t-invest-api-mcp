import { z } from 'zod';

// Zod схема для валидации параметров инструмента getEtfs
export const GetEtfsParamsSchema = z.object({
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

export type GetEtfsParams = z.infer<typeof GetEtfsParamsSchema>;

// Zod схема для валидации параметров инструмента getEtfBy
export const GetEtfByParamsSchema = z.object({
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

export type GetEtfByParams = z.infer<typeof GetEtfByParamsSchema>;
