import { ConfigService } from '@nestjs/config'

export const rabbitmqConfigFn = (configService: ConfigService) => ({
	uri: configService.get('RABBITMQ_URI'),
	connectionInitOptions: {
		wait: false,
	},
	exchanges: [
		{
			name: 'fchost',
			type: 'topic',
		},
	],
})
