export type TParseEmailTemplateParams = {
	file: string
	variables: Record<string, any>
}

export interface IEmailTemplateProvider<T = string> {
	parse(data: TParseEmailTemplateParams): Promise<T>
}
