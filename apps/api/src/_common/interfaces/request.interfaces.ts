import { Request } from 'express'
import { AccountEntity } from '@libs/db/entities'

export interface IRequest extends Request {
	account: AccountEntity
	headers: {
		[key: string]: string | string[] | undefined
		'x-api-key'?: string
	}
}
