import { TinkoffInvestApi } from 'tinkoff-invest-api';
import {
  GetCurrenciesParams,
  GetCurrenciesParamsSchema,
  GetCurrencyByParams,
  GetCurrencyByParamsSchema,
} from '../schemas/currencies';

export const getCurrenciesTool = {
  name: 'instruments_currencies',
  description: 'Список всех доступных валют с поддержкой пагинации',
  parameters: GetCurrenciesParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetCurrenciesParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });

      // Устанавливаем дефолтный лимит 500, если не указан
      const limit = params.limit || 500;
      const skip = params.skip || 0;

      const { instruments } = await api.instruments.currencies({});

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
      throw new Error(`Ошибка при получении списка валют: ${errorMessage}`);
    }
  },
};

export const getCurrencyByTool = {
  name: 'instruments_currencyBy',
  description: 'Получить валюту по её идентификатору (FIGI, тикер или UID)',
  parameters: GetCurrencyByParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetCurrencyByParams;
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

      const { instrument } = await api.instruments.currencyBy(request);

      if (!instrument) {
        return `Валюта с идентификатором "${params.id}" не найдена`;
      }

      return `instrument_id: ${instrument.uid}; ticker: ${instrument.ticker}; название: ${instrument.name}; лотность: ${instrument.lot}; валюта: ${instrument.currency};`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка при поиске валюты: ${errorMessage}`);
    }
  },
};
