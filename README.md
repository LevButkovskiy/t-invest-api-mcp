# MCP Сервер для Tinkoff Invest API

MCP сервер для работы с Tinkoff Invest API.

## Разработка

```bash
npm install
npm run build
npm start
```

### Docker

```bash
docker compose up --build
```

### Скрипты

-   `npm run dev` - разработка с hot reload
-   `npm run inspect` - тестирование через MCP Inspector
-   `npm run build` - компиляция TypeScript

## Технологии

-   TypeScript + FastMCP
-   Zod для валидации
-   Docker для развертывания
