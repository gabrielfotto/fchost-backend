export default {
	fraud: {
		MIN_INVOICE_COUNT: 5, // mínimo de dados para confiar na média
		Z_SCORE_THRESHOLD: 2, // desvios padrão acima da média para ser fraude
		// MAX_VARIATION_PERCENTAGE: 50, // variação percentual máxima aceitável
		MIN_FLAGGED_INVOICES: 20, // mínimo de faturas para considerar padrão suspeito no período de TIMEFRAME_HOURS_FOR_ANALYSIS
		TIMEFRAME_HOURS_FOR_ANALYSIS: 24, // janela de tempo para analisar comportamento
		INVOICE_HISTORY_LIMIT: 5, // quantas faturas recentes usar para média
	},
}
