import { Client, Message, Role, User } from "discord.js"
import { isNumeric, isRoleMention, isUserMention, NO_GUILD_REPLY, splitFirst } from "./shared"

interface ParserContext {
	client: Client
	cmd: Message
	token: string
	cmdName: string
	cmdDescription: string
	arg: Argument
}

type Parser = (ctx: ParserContext) => any

interface Argument {
	name: string
	description: string
	parser?: Parser
}

type InferArguments<T extends readonly Argument[]> = {
	[K in keyof T]: T[K] extends { parser: (...args: any[]) => infer R }
	? NonNullable<R>
	: string
}

const PREFIX = '?'

// Splits the input by spaces, but ignoring spaces within quotes,
// which should be treated as a single token.
function tokenize(input: string): string[] {
	return input
		.match(/"[^"]*"|'[^']*'|\S+/g)
		?.map(arg => arg.replace(/^['"]|['"]$/g, '')) ?? []
}

export const parse = {
	string: ({ token }: ParserContext): string => token,

	number: ({ cmd, token, arg }: ParserContext): number | undefined => {
		if (!isNumeric(token)) {
			cmd.reply(`Argument '${arg.name}' expected a number, but got '${token}'.`)
			return undefined
		}

		return Number(token)
	},

	user: ({ client, cmd, token, arg }: ParserContext): User | undefined => {
		if (!isUserMention(token)) {
			cmd.reply(`Argument '${arg.name}' expected an user mention.`)
			return undefined
		}

		const userId = token.replace(/[<@!>]/g, '')

		const user = client.users.cache.get(userId)
		if (!user) {
			cmd.reply(`User with ID '${userId}' not found.`)
			return undefined
		}

		return user
	},

	role: ({ cmd, token, arg }: ParserContext): Role | undefined => {
		if (!isRoleMention(token)) {
			cmd.reply(`Argument '${arg.name}' expected a role mention.`)
			return undefined
		}

		if (!cmd.guild) {
			cmd.reply(NO_GUILD_REPLY)
			return undefined
		}

		const roleId = token.replace(/<@&|>/g, '')
		const role = cmd.guild.roles.cache.get(roleId)

		if (!role) {
			cmd.reply(`Role with ID '${roleId}' not found.`)
			return undefined
		}

		return role
	},

	mention: (ctx: ParserContext): User | Role | undefined => {
		if (isUserMention(ctx.token)) {
			return parse.user(ctx)
		} else if (isRoleMention(ctx.token)) {
			return parse.role(ctx)
		} else {
			ctx.cmd.reply(`Argument '${ctx.arg.name}' expected a user or role mention.`)
			return undefined
		}
	},
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
