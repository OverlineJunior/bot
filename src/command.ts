import { Client, Message, User } from "discord.js"

type Parser = (client: Client, token: string) => any

type Parsers = [Parser, ...Parser[]]

const PREFIX = '?'

function splitFirst(input: string, separator: string): [string, string] {
	const [first, ...rest] = input.split(separator)

	return [first, rest.join(separator)]
}

// Splits the input by spaces, but ignoring spaces within quotes,
// which should be treated as a single token.
function tokenize(input: string): string[] {
	return input
		.match(/"[^"]*"|'[^']*'|\S+/g)
		?.map(arg => arg.replace(/^['"]|['"]$/g, '')) ?? []
}

export const parse = {
	string: (_: Client, token: string): string | undefined => token,

	number: (_: Client, token: string): number | undefined =>
		token ? Number(token) : undefined,

	user: (client: Client, token: string): User | undefined => {
		const userId = token?.replace(/[<@!>]/g, '')
		if (!userId) return undefined

		return client.users.cache.get(userId) || undefined
	},
}

export function command(
	client: Client,
	cmdName: string,
	handler: (msg: Message, ...args: string[]) => void,
): void

export function command<
	P extends Parsers,
	Args extends { [K in keyof P]: ReturnType<P[K]> },
>(
	client: Client,
	cmdName: string,
	handler: (msg: Message, ...args: Args) => void,
	parsers: P,
): void

export function command(
	client: Client,
	cmdName: string,
	handler: (msg: Message, ...args: any[]) => void,
	parsers?: Parsers,
) {
	client.on("messageCreate", (msg) => {
		if (msg.author.bot) return

		const [first, rest] = splitFirst(msg.content, " ")
		if (first !== `${PREFIX}${cmdName}`) return

		const args = tokenize(rest).map((token, i) => {
			if (parsers) {
				// Overflowing arguments are ignored.
				if (i >= parsers.length) {
					return undefined
				}

				return parsers[i](client, token)
			} else {
				return parse.string(client, token)
			}
		})

		handler(msg, ...args)
	})
}
