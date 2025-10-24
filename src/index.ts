import { FastMCP } from 'fastmcp';
import pJson from '../package.json';
import { getAccountsTool } from './tools/accounts';
import { getBondByTool, getBondsTool } from './tools/bonds';
import { getCurrenciesTool, getCurrencyByTool } from './tools/currencies';
import { getEtfByTool, getEtfsTool } from './tools/etf';
import { getFutureByTool, getFuturesTool } from './tools/futures';
import { getOptionByTool, getOptionsTool } from './tools/options';
import { getPortfolioTool } from './tools/portfolio';
import { getShareByTool, getSharesTool } from './tools/shares';
import { getUserInfoTool } from './tools/userInfo';

const version = `${pJson.version}` as `${number}.${number}.${number}`;
const port = parseInt(process.env.PORT || '8080');

const server = new FastMCP({
  name: 't-invest-api',
  version,
  authenticate: async (request) => {
    const token = request.headers['authorization']?.startsWith('Bearer ')
      ? request.headers['authorization'].slice(7)
      : undefined;

    if (!token) {
      throw new Response(null, {
        status: 401,
        statusText: 'Unauthorized: Bearer token required',
      });
    }

    return { token };
  },
});

// Регистрируем инструменты
server.addTool(getSharesTool);
server.addTool(getShareByTool);
server.addTool(getBondsTool);
server.addTool(getBondByTool);
server.addTool(getEtfsTool);
server.addTool(getEtfByTool);
server.addTool(getCurrenciesTool);
server.addTool(getCurrencyByTool);
server.addTool(getFuturesTool);
server.addTool(getFutureByTool);
server.addTool(getOptionsTool);
server.addTool(getOptionByTool);
server.addTool(getUserInfoTool);
server.addTool(getAccountsTool);
server.addTool(getPortfolioTool);

// Запускаем сервер
server.start({
  transportType: 'httpStream',
  httpStream: {
    host: '0.0.0.0',
    port,
    endpoint: '/mcp',
  },
});

console.info(
  `MCP сервер t-invest-api запущен и готов к работе на порту ${port}`,
);
