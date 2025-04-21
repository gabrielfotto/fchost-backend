import { Injectable } from '@nestjs/common'
import { AppService } from './app.service'

@Injectable()
export class AppCron {
	constructor(private readonly appService: AppService) {}
}
