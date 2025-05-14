import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IRequest } from '../interfaces/request.interfaces'

export const Account = createParamDecorator(
	(key: string, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<IRequest>()
		return key ? request.account[key] : request.account
	},
)
