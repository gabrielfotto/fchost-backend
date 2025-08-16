import { Injectable } from '@nestjs/common'

import { IFraudSpecification } from '../interfaces'

import { AccountEntity } from '@libs/db/entities'
import { EFraudReason } from '@libs/common/enums'

@Injectable()
export default class FraudSuspiciousAccountEspecification
	implements IFraudSpecification
{
	constructor() {}

	isSatisfied(account: AccountEntity, amount: string): Promise<boolean> {
		return Promise.resolve(account.isSuspicious)
	}

	getFraudReason(
		account: AccountEntity,
		amount: string,
	): { reason: EFraudReason; description: string } {
		return {
			reason: EFraudReason.SUSPICIOUS_ACCOUNT,
			description: `Account ${account.id} is suspicious`,
		}
	}
}
