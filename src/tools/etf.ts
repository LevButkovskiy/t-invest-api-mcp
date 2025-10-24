import { TinkoffInvestApi } from 'tinkoff-invest-api';
import {
  GetEtfByParams,
  GetEtfByParamsSchema,
  GetEtfsParams,
  GetEtfsParamsSchema,
} from '../schemas/etf';

export const getEtfsTool = {
  name: 'instruments_etfs',
  description: 'Список всех доступных ETF с поддержкой пагинации',
  parameters: GetEtfsParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetEtfsParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });

      // Устанавливаем дефолтный лимит 500, если не указан
      const limit = params.limit || 500;
      const skip = params.skip || 0;

      const { instruments } = await api.instruments.etfs({});

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
      throw new Error(`Ошибка при получении списка ETF: ${errorMessage}`);
    }
  },
};

export const getEtfByTool = {
  name: 'instruments_etfBy',
  description: 'Получить ETF по его идентификатору (FIGI, тикер или UID)',
  parameters: GetEtfByParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetEtfByParams;
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

      const { instrument } = await api.instruments.etfBy(request);

      if (!instrument) {
        return `ETF с идентификатором "${params.id}" не найден`;
      }

      return `instrument_id: ${instrument.uid}; ticker: ${instrument.ticker}; название: ${instrument.name}; лотность: ${instrument.lot}; валюта: ${instrument.currency};`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка при поиске ETF: ${errorMessage}`);
    }
  },
};
