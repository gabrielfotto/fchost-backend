export default {
	fraud: {
		MAX_VARIATION_PERCENTAGE: 50, // variação percentual máxima aceitável
		MIN_FLAGGED_INVOICES: 5, // mínimo de faturas para considerar padrão suspeito
		TIMEFRAME_HOURS_FOR_ANALYSIS: 24, // janela de tempo para analisar comportamento
		INVOICE_HISTORY_LIMIT: 5, // quantas faturas recentes usar para média
	},
}
