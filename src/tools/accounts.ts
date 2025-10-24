import { TinkoffInvestApi } from 'tinkoff-invest-api';
import {
  GetAccountsParams,
  GetAccountsParamsSchema,
} from '../schemas/accounts';

export const getAccountsTool = {
  name: 'users_getAccounts',
  description: 'Позволяет получить информацию о счетах пользователя',
  parameters: GetAccountsParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetAccountsParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });
      const { accounts } = await api.users.getAccounts(params);

      return accounts
        .map(
          (account) =>
            `id: ${account.id}, name: ${account.name}, type: ${account.type}, status: ${account.status}`,
        )
        .join('\n');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(
        `Ошибка при получении счетов пользователя: ${errorMessage}`,
      );
    }
  },
};
