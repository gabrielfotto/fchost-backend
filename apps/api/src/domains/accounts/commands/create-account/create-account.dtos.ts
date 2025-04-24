import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateAccountInputDTO {
	@IsString()
	name: string

	@IsEmail()
	email: string

	@IsOptional()
	@IsNumber()
	balance?: string
}
