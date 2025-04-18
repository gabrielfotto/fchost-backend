import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IRequest } from '../interfaces/request.interfaces'

export const Account = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<IRequest>()
		return request.account
	},
)
