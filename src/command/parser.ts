import { Client, Message, Role, User } from "discord.js"
import { isNumeric, isRoleMention, isUserMention, NO_GUILD_REPLY } from "../shared"

export interface ParserContext {
	client: Client
	cmd: Message
	token: string
	cmdName: string
	cmdDescription: string
	arg: Argument
}

export type Parser = (ctx: ParserContext) => any

export interface Argument {
	name: string
	description: string
	parser?: Parser
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
