import { Helpers, TinkoffInvestApi } from 'tinkoff-invest-api';
import {
  GetPortfolioParams,
  GetPortfolioParamsSchema,
} from '../schemas/portfolio';

// Вспомогательные функции для форматирования
const formatMoney = (money: any): string => {
  if (!money) return '0 ₽';
  return Helpers.toMoneyString(money);
};

const formatNumber = (quotation: any): string => {
  if (!quotation) return '0';
  const number = Helpers.toNumber(quotation);
  return number ? number.toString() : '0';
};

const formatPercentage = (quotation: any): string => {
  if (!quotation) return '0%';
  const value = Helpers.toNumber(quotation);
  return value ? `${value.toFixed(2)}%` : '0%';
};

const formatPosition = (position: any): string => {
  const ticker = position.ticker || 'N/A';
  const instrumentType = position.instrumentType || 'N/A';
  const instrumentUid = position.instrumentUid || 'N/A';
  const quantity = formatNumber(position.quantity);
  const currentPrice = formatMoney(position.currentPrice);
  const averagePrice = formatMoney(position.averagePositionPrice);
  const expectedYield = formatMoney(position.expectedYield);
  const dailyYield = formatMoney(position.dailyYield);
  const blocked = position.blocked ? ' (заблокировано)' : '';

  return `• ${ticker} (${instrumentType})${blocked}
  instrumentUid: ${instrumentUid}
  Количество: ${quantity} лотов
  Текущая цена: ${currentPrice}
  Средняя цена: ${averagePrice}
  Ожидаемая доходность: ${expectedYield}
  Дневная доходность: ${dailyYield}`;
};

const formatVirtualPosition = (position: any): string => {
  const ticker = position.ticker || 'N/A';
  const instrumentType = position.instrumentType || 'N/A';
  const instrumentUid = position.instrumentUid || 'N/A';
  const quantity = formatNumber(position.quantity);
  const currentPrice = formatMoney(position.currentPrice);
  const averagePrice = formatMoney(position.averagePositionPrice);
  const expectedYield = formatMoney(position.expectedYield);
  const expireDate = position.expireDate
    ? new Date(position.expireDate).toLocaleDateString('ru-RU')
    : 'N/A';

  return `• ${ticker} (${instrumentType}) - истекает ${expireDate}
  instrumentUid: ${instrumentUid}
  Количество: ${quantity} лотов
  Текущая цена: ${currentPrice}
  Средняя цена: ${averagePrice}
  Ожидаемая доходность: ${expectedYield}`;
};

export const getPortfolioTool = {
  name: 'operations_getPortfolio',
  description:
    'Возвращает детальную информацию о портфеле по счету: общая стоимость, доходность, открытые позиции, виртуальные позиции. Каждая позиция содержит instrumentUid для получения детальной информации. Для получения списка всех доступных инструментов используйте: instruments_shares (акции), instruments_bonds (облигации), instruments_etfs (ETF), instruments_currencies (валюты), instruments_futures (фьючерсы), instruments_options (опционы). Для детальной информации по конкретному инструменту используйте: instruments_shareBy, instruments_bondBy, instruments_etfBy, instruments_currencyBy, instruments_futureBy, instruments_optionBy с instrumentUid из позиций.',
  parameters: GetPortfolioParamsSchema,
  execute: async (args: unknown, context: any) => {
    const params = args as GetPortfolioParams;
    try {
      const api = new TinkoffInvestApi({ token: context.session.token });
      const portfolio = await api.operations.getPortfolio({
        accountId: params.accountId,
      });

      // Общая информация о портфеле
      const totalPortfolio = formatMoney(portfolio.totalAmountPortfolio);
      const totalShares = formatMoney(portfolio.totalAmountShares);
      const totalBonds = formatMoney(portfolio.totalAmountBonds);
      const totalEtf = formatMoney(portfolio.totalAmountEtf);
      const totalCurrencies = formatMoney(portfolio.totalAmountCurrencies);
      const totalFutures = formatMoney(portfolio.totalAmountFutures);
      const totalOptions = formatMoney(portfolio.totalAmountOptions);
      const totalSp = formatMoney(portfolio.totalAmountSp);

      // Доходность
      const expectedYield = formatMoney(portfolio.expectedYield);
      const expectedYieldRelative = formatPercentage(
        (portfolio as any).expectedYieldRelative,
      );
      const dailyYield = formatMoney(portfolio.dailyYield);
      const dailyYieldRelative = formatPercentage(
        (portfolio as any).dailyYieldRelative,
      );

      // Позиции
      const positionsText =
        portfolio.positions.length > 0
          ? portfolio.positions.map(formatPosition).join('\n\n')
          : 'Нет открытых позиций';

      // Виртуальные позиции
      const virtualPositionsText =
        portfolio.virtualPositions && portfolio.virtualPositions.length > 0
          ? portfolio.virtualPositions.map(formatVirtualPosition).join('\n\n')
          : 'Нет виртуальных позиций';

      return `📊 ПОРТФЕЛЬ (Счет: ${portfolio.accountId})

💰 ОБЩАЯ СТОИМОСТЬ
Общая стоимость портфеля: ${totalPortfolio}
• Акции: ${totalShares}
• Облигации: ${totalBonds}
• ETF: ${totalEtf}
• Валюты: ${totalCurrencies}
• Фьючерсы: ${totalFutures}
• Опционы: ${totalOptions}
• Структурные продукты: ${totalSp}

📈 ДОХОДНОСТЬ
Ожидаемая доходность: ${expectedYield} (${expectedYieldRelative})
Дневная доходность: ${dailyYield} (${dailyYieldRelative})

📋 ОТКРЫТЫЕ ПОЗИЦИИ
${positionsText}

🎯 ВИРТУАЛЬНЫЕ ПОЗИЦИИ
${virtualPositionsText}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка при получении портфеля: ${errorMessage}`);
    }
  },
};
