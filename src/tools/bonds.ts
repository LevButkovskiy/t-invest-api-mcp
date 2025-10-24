import { TinkoffInvestApi } from 'tinkoff-invest-api';
import {
  GetBondByParams,
  GetBondByParamsSchema,
  GetBondsParams,
  GetBondsParamsSchema,
} from '../schemas/bonds';

export const getBondsTool = {
  name: 'instruments/bonds',
  description: 'Список всех доступных облигаций с поддержкой пагинации',
  parameters: GetBondsParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetBondsParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });

      // Устанавливаем дефолтный лимит 500, если не указан
      const limit = params.limit || 500;
      const skip = params.skip || 0;

      const { instruments } = await api.instruments.bonds({});

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
      throw new Error(`Ошибка при получении списка облигаций: ${errorMessage}`);
    }
  },
};

export const getBondByTool = {
  name: 'instruments/bondBy',
  description: 'Получить облигацию по её идентификатору (FIGI, тикер или UID)',
  parameters: GetBondByParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetBondByParams;
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

      const { instrument } = await api.instruments.bondBy(request);

      if (!instrument) {
        return `Облигация с идентификатором "${params.id}" не найдена`;
      }

      return `instrument_id: ${instrument.uid}; ticker: ${instrument.ticker}; название: ${instrument.name}; лотность: ${instrument.lot}; валюта: ${instrument.currency};`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка при поиске облигации: ${errorMessage}`);
    }
  },
};
