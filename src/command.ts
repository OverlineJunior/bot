import { Client, Message, User } from "discord.js"

type Parser = (client: Client, arg: string) => any

type Parsers = [Parser, ...Parser[]]

const PREFIX = '?'

export const parse = {
	string: (_: Client, arg?: string): string | undefined => arg,
	number: (_: Client, arg?: string): number | undefined => arg ? Number(arg) : undefined,
	user: (client: Client, arg?: string): User | undefined => {
		const userId = arg?.replace(/[<@!>]/g, '')
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

		const args = msg.content.split(" ")
		if (args[0] !== `${PREFIX}${cmdName}`) return

		const parsedArgs = parsers
			? parsers.map((parse, i) => parse(client, args[i + 1]))
			: args.slice(1)

		handler(msg, ...parsedArgs)
	})
}
