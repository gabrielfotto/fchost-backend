import {
	IsString,
	IsCreditCard,
	Matches,
	Length,
	IsNumberString,
	IsNumber,
	Min,
	IsDefined,
	ValidateNested,
} from 'class-validator'
import { Expose, Type } from 'class-transformer'
import { TCreditCard } from '../../types/credit-card.types'

// INPUTS
class CreditCardInputDTO {
	@IsString()
	cardholderName: string

	@IsCreditCard()
	cardNumber: string

	@IsNumberString()
	@Length(2, 2)
	@Matches(/^(0[1-9]|1[0-2])$/, {
		message: 'expiryMonth must be a valid month (01-12)',
	})
	expiryMonth: number

	@IsNumberString()
	@Length(2)
	expiryYear: number

	@IsNumberString()
	@Length(3)
	cvv: string
}

export class CreateInvoiceInputDTO {
	@IsNumber()
	@Min(0.1)
	amount: number

	@IsString()
	description: string

	@IsString()
	paymentType: string

	@IsDefined()
	@ValidateNested({ each: false })
	@Type(() => CreditCardInputDTO)
	card: TCreditCard
}

// OUTPUTS
export class CreateInvoiceOutputDTO {
	@Expose()
	amount: number

	@Expose()
	description: string

	@Expose()
	paymentType: string
}
