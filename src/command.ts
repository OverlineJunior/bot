import { Client, Message } from "discord.js"

type Parser = (arg: string) => any

type Parsers = [Parser, ...Parser[]]

const PREFIX = '?'

export const parse = {
	string: (arg: string): string => arg,
	number: (arg: string): number => Number(arg),
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
			? parsers.map((parse, i) => parse(args[i + 1]))
			: args.slice(1)

		handler(msg, ...parsedArgs)
	})
}
