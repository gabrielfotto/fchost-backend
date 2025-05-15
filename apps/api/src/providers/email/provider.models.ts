export type TSendEmailParams = {
	to: string
	from: string
	subject: string
	template: {
		filePath: string
		variables: Record<string, any>
	}
}

export interface IEmailProvider<T = any> {
	send(data: TSendEmailParams): Promise<T>
}
