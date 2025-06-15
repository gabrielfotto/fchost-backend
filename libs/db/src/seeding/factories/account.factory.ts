import { setSeederFactory } from 'typeorm-extension'

import { AccountEntity } from '../../entities'

// Array de nomes e emails para teste
const testData = [
	{ name: 'John Doe', email: 'john@example.com' },
	{ name: 'Jane Smith', email: 'jane@example.com' },
	{ name: 'Bob Johnson', email: 'bob@example.com' },
	{ name: 'Alice Brown', email: 'alice@example.com' },
	{ name: 'Charlie Wilson', email: 'charlie@example.com' },
]

let currentIndex = 0

export const AccountFactory = setSeederFactory(AccountEntity, () => {
	const account = new AccountEntity()

	// Usa dados fixos do array
	const data = testData[currentIndex % testData.length]
	currentIndex++

	account.name = data.name
	account.email = data.email

	// Gera um saldo inicial aleatório entre 100 e 1000
	// @ts-ignore
	account.balance = 10

	// O apiKey será gerado automaticamente pelo @BeforeInsert
	return account
})
