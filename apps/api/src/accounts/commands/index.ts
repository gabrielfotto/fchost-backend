import CreateAccountCommandHandler from './create-account/create-account.handler'
import ValidateApiKeyCommandHandler from './validate-api-key/validate-api-key.handler'

const AccountCommandHandlers = [
	CreateAccountCommandHandler,
	ValidateApiKeyCommandHandler,
]

export default AccountCommandHandlers
