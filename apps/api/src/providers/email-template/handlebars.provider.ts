import fs from 'fs'
import handlebars from 'handlebars'
import { Injectable } from '@nestjs/common'

import {
	IEmailTemplateProvider,
	TParseEmailTemplateParams,
} from './provider.models'

@Injectable()
export class HandlebarsEmailTemplateProvider implements IEmailTemplateProvider {
	async parse({
		filePath,
		variables,
	}: TParseEmailTemplateParams): Promise<string> {
		const content = await fs.promises.readFile(filePath, {
			encoding: 'utf-8',
		})

		const parse = handlebars.compile(content)
		return parse(variables)
	}
}
