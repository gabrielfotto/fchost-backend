import {
	plainToInstance,
	ClassConstructor,
	ClassTransformOptions,
} from 'class-transformer'
import { validate, ValidatorOptions, ValidationError } from 'class-validator'

export interface TransformAndValidateOptions {
	transformerOptions?: ClassTransformOptions
	validatorOptions?: ValidatorOptions
}

// --- Definição com Overloads ---

// Overload 1: Entrada é array, Saída é Promise<array>
export async function plainToInstanceAndValidate<T extends object, V>(
	targetClass: ClassConstructor<T>,
	plain: V[], // Entrada é array
	options?: TransformAndValidateOptions,
): Promise<T[]> // Saída é Promise de array

// Overload 2: Entrada é objeto único, Saída é Promise<objeto único>
export async function plainToInstanceAndValidate<T extends object, V>(
	targetClass: ClassConstructor<T>,
	plain: V, // Entrada é objeto
	options?: TransformAndValidateOptions,
): Promise<T> // Saída é Promise de objeto

// Implementação (a assinatura da implementação pode ser mais genérica)
export async function plainToInstanceAndValidate<T extends object, V>(
	targetClass: ClassConstructor<T>,
	plain: V | V[],
	options?: TransformAndValidateOptions,
): Promise<T | T[]> {
	// O tipo de retorno da implementação ainda é a união

	const transformerOptions = {
		excludeExtraneousValues: true,
		...options?.transformerOptions,
	}
	const validatorOptions = {
		// whitelist: true,
		forbidNonWhitelisted: true,
		...options?.validatorOptions,
	}

	const instances = plainToInstance(targetClass, plain, transformerOptions)

	if (Array.isArray(instances)) {
		// Verifica se a *saída* da transformação é um array
		const errorsArray: ValidationError[][] = await Promise.all(
			instances.map(instance => validate(instance, validatorOptions)),
		)
		const flatErrors: ValidationError[] = errorsArray.flat()
		if (flatErrors.length > 0) {
			console.error('Validation failed for multiple instances:', flatErrors)
			throw new Error(`Validation failed: ${JSON.stringify(flatErrors)}`)
		}
		return instances // Retorna array
	} else if (typeof instances === 'object' && instances !== null) {
		const errors = await validate(instances as T, validatorOptions)
		if (errors.length > 0) {
			console.error('Validation failed for single instance:', errors)
			throw new Error(`Validation failed: ${JSON.stringify(errors)}`)
		}
		return instances as T // Retorna objeto único
	} else {
		// Caso plain seja algo inesperado
		throw new Error('Transformation resulted in a non-object/array type.')
	}
}
