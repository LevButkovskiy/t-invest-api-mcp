import { Helpers, TinkoffInvestApi } from 'tinkoff-invest-api';
import {
  GetPortfolioParams,
  GetPortfolioParamsSchema,
} from '../schemas/portfolio';

export const getPortfolioTool = {
  name: 'operations/getPortfolio',
  description:
    'Возвращает информацию о портфеле по счету: сумма, доступный баланс, открытые позиции',
  parameters: GetPortfolioParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetPortfolioParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });
      const portfolio = await api.operations.getPortfolio({
        accountId: params.accountId,
      });

      const totalAmount = Helpers.toMoneyString(portfolio.totalAmountPortfolio);
      const availableBalance = Helpers.toMoneyString(
        portfolio.totalAmountCurrencies,
      );

      const positions = portfolio.positions
        .map(
          (position) =>
            `instrumentUid: ${
              position.instrumentUid
            }, количество: ${Helpers.toNumber(
              position.quantity,
            )}, средняя цена: ${Helpers.toMoneyString(
              position.averagePositionPrice,
            )} текущая цена: ${Helpers.toMoneyString(position.currentPrice)}`,
        )
        .join(', ');

      return `Общая сумма: ${totalAmount}; Доступный баланс: ${availableBalance}\n\nОткрытые позиции - ${positions}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка при получении портфеля: ${errorMessage}`);
    }
  },
};
