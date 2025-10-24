import { TinkoffInvestApi } from 'tinkoff-invest-api';
import {
  GetShareByParams,
  GetShareByParamsSchema,
  GetSharesParams,
  GetSharesParamsSchema,
} from '../schemas/shares';

export const getSharesTool = {
  name: 'instruments/shares',
  description: 'Список всех доступных акций с поддержкой пагинации',
  parameters: GetSharesParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetSharesParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });

      // Устанавливаем дефолтный лимит 500, если не указан
      const limit = params.limit || 500;
      const skip = params.skip || 0;

      const { instruments } = await api.instruments.shares({});

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
      throw new Error(`Ошибка при получении списка акций: ${errorMessage}`);
    }
  },
};

export const getShareByTool = {
  name: 'instruments/shareBy',
  description: 'Получить акцию по её идентификатору (FIGI, тикер или UID)',
  parameters: GetShareByParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetShareByParams;
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

      const { instrument } = await api.instruments.shareBy(request);

      if (!instrument) {
        return `Акция с идентификатором "${params.id}" не найдена`;
      }

      return `instrument_id: ${instrument.uid}; ticker: ${instrument.ticker}; название: ${instrument.name}; лотность: ${instrument.lot}; валюта: ${instrument.currency};`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка при поиске акции: ${errorMessage}`);
    }
  },
};
