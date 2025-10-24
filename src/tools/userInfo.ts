import { TinkoffInvestApi } from 'tinkoff-invest-api';
import {
  GetUserInfoParams,
  GetUserInfoParamsSchema,
} from '../schemas/userInfo';

export const getUserInfoTool = {
  name: 'users_getInfo',
  description:
    'Получить информацию о пользователе: тариф, признак квалификации, пройденные тесты и др.',
  parameters: GetUserInfoParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetUserInfoParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });
      const info = await api.users.getInfo(params);

      return `Тариф: ${info.tariff}; Премиум: ${
        info.premStatus ? 'Да' : 'Нет'
      }; Квалификация: ${
        info.qualStatus ? 'Да' : 'Нет'
      }; Может работать с ${info.qualifiedForWorkWith.join(', ')}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(
        `Ошибка при получении информации о пользователе: ${errorMessage}`,
      );
    }
  },
};
