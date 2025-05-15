export type TParseEmailTemplateParams = {
	filePath: string
	variables: Record<string, any>
}

export interface IEmailTemplateProvider<T = string> {
	parse(data: TParseEmailTemplateParams): Promise<T>
}
