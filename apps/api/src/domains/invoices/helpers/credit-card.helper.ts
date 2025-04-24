import { TCreditCard } from '../types/credit-card.types'

export class CreditCardHelper {
	constructor(private readonly card: TCreditCard) {
		this.card = card
	}

	get cardLast4Digits() {
		if (!this.card) return ''
		return this.card.cardNumber?.replace(/\s+/g, '').slice(12)
	}
}
