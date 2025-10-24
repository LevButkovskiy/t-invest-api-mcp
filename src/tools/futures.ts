import { TinkoffInvestApi } from 'tinkoff-invest-api';
import {
  GetFutureByParams,
  GetFutureByParamsSchema,
  GetFuturesParams,
  GetFuturesParamsSchema,
} from '../schemas/futures';

export const getFuturesTool = {
  name: 'instruments_futures',
  description: 'Список всех доступных фьючерсов с поддержкой пагинации',
  parameters: GetFuturesParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetFuturesParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });

      // Устанавливаем дефолтный лимит 500, если не указан
      const limit = params.limit || 500;
      const skip = params.skip || 0;

      const { instruments } = await api.instruments.futures({});

      // Применяем пагинацию к результатам
      const paginatedInstruments = instruments.slice(skip, skip + limit);

      return paginatedInstruments
        .map(
          (instrument) =>
            `instrument_id: ${instrument.uid}; ticker: ${instrument.ticker}; название: ${instrument.name}; лотность: ${instrument.lot}; валюта: ${instrument.currency};`,
        )
        .join('\n');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка при получении списка фьючерсов: ${errorMessage}`);
    }
  },
};

export const getFutureByTool = {
  name: 'instruments_futureBy',
  description: 'Получить фьючерс по его идентификатору (FIGI, тикер или UID)',
  parameters: GetFutureByParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetFutureByParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });

      // Преобразуем строковые значения в enum для API
      const idTypeMap = {
        INSTRUMENT_ID_TYPE_FIGI: 1,
        INSTRUMENT_ID_TYPE_TICKER: 2,
        INSTRUMENT_ID_TYPE_UID: 3,
      };

      const request = {
        idType: idTypeMap[params.idType],
        id: params.id,
        classCode: params.classCode,
      };

      const { instrument } = await api.instruments.futureBy(request);

      if (!instrument) {
        return `Фьючерс с идентификатором "${params.id}" не найден`;
      }

      return `instrument_id: ${instrument.uid}; ticker: ${instrument.ticker}; название: ${instrument.name}; лотность: ${instrument.lot}; валюта: ${instrument.currency};`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка при поиске фьючерса: ${errorMessage}`);
    }
  },
};
