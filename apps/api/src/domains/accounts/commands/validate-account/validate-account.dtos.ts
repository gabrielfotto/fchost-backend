import { Exclude, Expose } from 'class-transformer'
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator'

// INPUT
export class ValidateAccountInputDTO {
	@IsString()
	name: string

	@IsEmail()
	email: string

	// @IsOptional()
	// @IsNumber()
	// balance?: string
}

// OUTPUT
@Exclude()
export class ValidateAccountOutputDTO {
	// @Expose()
	// name: string
	// @Expose()
	// email: string
	// @Expose()
	// apiKey: string
}
