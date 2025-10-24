import { z } from 'zod';

// Схема для денежных сумм
const MoneySchema = z.object({
  currency: z.string().describe('Валюта'),
  units: z.string().describe('Целые единицы'),
  nano: z.number().describe('Дробная часть в наносекундах'),
});

// Схема для количества
const QuotationSchema = z.object({
  units: z.string().describe('Целые единицы'),
  nano: z.number().describe('Дробная часть в наносекундах'),
});

// Схема для позиции
const PositionSchema = z.object({
  figi: z.string().describe('FIGI инструмента'),
  instrumentType: z.string().describe('Тип инструмента'),
  quantity: QuotationSchema.describe('Количество в лотах'),
  averagePositionPrice: MoneySchema.describe('Средняя цена позиции'),
  expectedYield: QuotationSchema.describe('Ожидаемая доходность'),
  currentNkd: MoneySchema.describe('Текущий НКД'),
  averagePositionPriceFifo: MoneySchema.describe('Средняя цена позиции FIFO'),
  quantityLots: QuotationSchema.describe('Количество в лотах'),
  blocked: z.boolean().describe('Заблокировано ли'),
  blockedLots: QuotationSchema.describe('Заблокированные лоты'),
  positionUid: z.string().describe('Уникальный идентификатор позиции'),
  instrumentUid: z.string().describe('Уникальный идентификатор инструмента'),
  varMargin: MoneySchema.describe('Вариационная маржа'),
  expectedYieldFifo: QuotationSchema.describe('Ожидаемая доходность FIFO'),
  averagePositionPricePt: QuotationSchema.describe(
    'Средняя цена позиции в пунктах',
  ),
  currentPrice: MoneySchema.describe('Текущая цена'),
  dailyYield: MoneySchema.describe('Дневная доходность'),
  ticker: z.string().describe('Тикер инструмента'),
});

// Схема для виртуальной позиции
const VirtualPositionSchema = z.object({
  figi: z.string().describe('FIGI инструмента'),
  instrumentType: z.string().describe('Тип инструмента'),
  quantity: QuotationSchema.describe('Количество в лотах'),
  averagePositionPrice: MoneySchema.describe('Средняя цена позиции'),
  expectedYield: QuotationSchema.describe('Ожидаемая доходность'),
  positionUid: z.string().describe('Уникальный идентификатор позиции'),
  instrumentUid: z.string().describe('Уникальный идентификатор инструмента'),
  expectedYieldFifo: QuotationSchema.describe('Ожидаемая доходность FIFO'),
  averagePositionPriceFifo: MoneySchema.describe('Средняя цена позиции FIFO'),
  currentPrice: MoneySchema.describe('Текущая цена'),
  dailyYield: MoneySchema.describe('Дневная доходность'),
  expireDate: z.string().describe('Дата истечения'),
  ticker: z.string().describe('Тикер инструмента'),
});

// Zod схема для валидации параметров инструмента getPortfolio
export const GetPortfolioParamsSchema = z.object({
  accountId: z.string().min(1).describe('ID счета для получения портфеля'),
});

export type GetPortfolioParams = z.infer<typeof GetPortfolioParamsSchema>;

// Схема для полного ответа портфеля
export const PortfolioResponseSchema = z.object({
  totalAmountShares: MoneySchema.describe('Общая стоимость акций'),
  totalAmountBonds: MoneySchema.describe('Общая стоимость облигаций'),
  totalAmountEtf: MoneySchema.describe('Общая стоимость ETF'),
  totalAmountCurrencies: MoneySchema.describe('Общая стоимость валют'),
  totalAmountFutures: MoneySchema.describe('Общая стоимость фьючерсов'),
  totalAmountOptions: MoneySchema.describe('Общая стоимость опционов'),
  totalAmountSp: MoneySchema.describe('Общая стоимость структурных продуктов'),
  totalAmountPortfolio: MoneySchema.describe('Общая стоимость портфеля'),
  expectedYield: QuotationSchema.describe('Ожидаемая доходность портфеля'),
  expectedYieldRelative: QuotationSchema.describe(
    'Ожидаемая доходность портфеля в процентах',
  ),
  positions: z.array(PositionSchema).describe('Позиции в портфеле'),
  virtualPositions: z
    .array(VirtualPositionSchema)
    .describe('Виртуальные позиции'),
  accountId: z.string().describe('ID счета'),
  dailyYield: MoneySchema.describe('Дневная доходность'),
  dailyYieldRelative: QuotationSchema.describe(
    'Дневная доходность в процентах',
  ),
});

export type PortfolioResponse = z.infer<typeof PortfolioResponseSchema>;
