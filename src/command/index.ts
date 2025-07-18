import { Client, Message } from "discord.js"
import { splitFirst } from "../shared"
import { parse, Argument } from "./parser"

type InferArguments<T extends readonly Argument[]> = {
	[K in keyof T]: T[K] extends { parser: (...args: any[]) => infer R }
	? NonNullable<R>
	: string
}

const PREFIX = '?'

export { parse }

// Splits the input by spaces, but ignoring spaces within quotes,
// which should be treated as a single token.
function tokenize(input: string): string[] {
	return input
		.match(/"[^"]*"|'[^']*'|\S+/g)
		?.map(arg => arg.replace(/^['"]|['"]$/g, '')) ?? []
}

export function command<const Args extends readonly Argument[]>(
	client: Client,
	name: string,
	description: string,
	arguments_: Args,
	handler: (cmd: Message, ...args: InferArguments<Args>) => void,
) {
	client.on("messageCreate", (cmd) => {
		if (cmd.author.bot) return

		const [first, rest] = splitFirst(cmd.content, " ")
		if (first !== `${PREFIX}${name}`) return

		const args = tokenize(rest).map((token, i) => {
			const arg = arguments_[i]
			if (!arg || !arg.parser) {
				return parse.string({
					client,
					cmd,
					token,
					cmdName: name,
					cmdDescription: description,
					arg,
				})
			}

			return arg.parser({
				client,
				cmd,
				token,
				cmdName: name,
				cmdDescription: description,
				arg,
			})
		})

		if (args.length < arguments_.length) {
			const missingArgs = arguments_
				.slice(args.length)
				.map(arg => arg.name)
				.join(', ')

			cmd.reply(`Missing arguments: ${missingArgs}.`)
			return
		}

		if (args.length > arguments_.length) {
			const overflowArgs = args
				.slice(arguments_.length)
				.map((_, i) => `argument ${i + arguments_.length + 1}`)
				.join(', ')

			cmd.reply(`Too many arguments provided: ${overflowArgs}.`)
			return
		}

		if (args.every(arg => arg !== undefined)) {
			handler(cmd, ...args as InferArguments<Args>)
		}
	})
}
