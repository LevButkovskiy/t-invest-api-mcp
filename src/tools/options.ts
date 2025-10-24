import { TinkoffInvestApi } from 'tinkoff-invest-api';
import {
  GetOptionByParams,
  GetOptionByParamsSchema,
  GetOptionsParams,
  GetOptionsParamsSchema,
} from '../schemas/options';

export const getOptionsTool = {
  name: 'instruments_options',
  description: 'Список всех доступных опционов с поддержкой пагинации',
  parameters: GetOptionsParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetOptionsParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });

      // Устанавливаем дефолтный лимит 500, если не указан
      const limit = params.limit || 500;
      const skip = params.skip || 0;

      const { instruments } = await api.instruments.options({});

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
      throw new Error(`Ошибка при получении списка опционов: ${errorMessage}`);
    }
  },
};

export const getOptionByTool = {
  name: 'instruments_optionBy',
  description: 'Получить опцион по его идентификатору (FIGI, тикер или UID)',
  parameters: GetOptionByParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetOptionByParams;
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

      const { instrument } = await api.instruments.optionBy(request);

      if (!instrument) {
        return `Опцион с идентификатором "${params.id}" не найден`;
      }

      return `instrument_id: ${instrument.uid}; ticker: ${instrument.ticker}; название: ${instrument.name}; лотность: ${instrument.lot}; валюта: ${instrument.currency};`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка при поиске опциона: ${errorMessage}`);
    }
  },
};
