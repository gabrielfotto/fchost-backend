import * as fs from 'fs'
import * as path from 'path'

import handlebars from 'handlebars'
import { Injectable } from '@nestjs/common'

import {
	IEmailTemplateProvider,
	TParseEmailTemplateParams,
} from './provider.models'

@Injectable()
export class HandlebarsEmailTemplateProvider implements IEmailTemplateProvider {
	async parse({ file, variables }: TParseEmailTemplateParams): Promise<string> {
		const filePath = path.join(__dirname, 'views', 'emails', `${file}.hbs`)

		const content = await fs.promises.readFile(filePath, {
			encoding: 'utf-8',
		})

		const parse = handlebars.compile(content)
		return parse(variables)
	}
}
