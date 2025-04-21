import { Exclude, Expose } from 'class-transformer'
import { IsDefined } from 'class-validator'
import { EInvoiceStatus } from '@libs/shared/enums'

@Exclude()
export class GetTransactionsByAccountOutputDTO {}
