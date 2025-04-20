import { Injectable } from '@nestjs/common'

import { IFraudEspecification } from '../interfaces'
import { AccountEntity } from '@libs/db/entities'
import { EFraudReason } from '@libs/db/enums'

@Injectable()
export default class FraudSuspiciousAccountEspecification
	implements IFraudEspecification
{
	constructor() {}

	isSatisfied(account: AccountEntity, amount: number): Promise<boolean> {
		return Promise.resolve(account.isSuspicious)
	}

	getFraudReason(
		account: AccountEntity,
		amount: number,
	): { reason: EFraudReason; description: string } {
		return {
			reason: EFraudReason.SUSPICIOUS_ACCOUNT,
			description: `Account ${account.id} is suspicious`,
		}
	}
}
