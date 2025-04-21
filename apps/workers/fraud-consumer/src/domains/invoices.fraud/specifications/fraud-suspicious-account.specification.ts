import { Injectable } from '@nestjs/common'

import { IFraudSpecification } from '../interfaces'

import { AccountEntity } from '@libs/db/entities'
import { EFraudReason } from '@libs/shared/enums'

@Injectable()
export default class FraudSuspiciousAccountEspecification
	implements IFraudSpecification
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
