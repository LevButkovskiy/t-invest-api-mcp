import { z } from 'zod';

// Zod схема для валидации параметров инструмента getPortfolio
export const GetPortfolioParamsSchema = z.object({
	accountId: z
		.string()
		.min(1)
		.describe('ID счета для получения портфеля'),
});

export type GetPortfolioParams = z.infer<typeof GetPortfolioParamsSchema>;
