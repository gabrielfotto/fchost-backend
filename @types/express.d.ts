// types/express.d.ts
import { AccountEntity } from '@libs/db/entities'

declare global {
	namespace Express {
		interface Request {
			account?: AccountEntity
		}
	}
}
