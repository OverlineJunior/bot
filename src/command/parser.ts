import { Client, GuildMember, Message, Role, User } from "discord.js"
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

const EXPECTED_REPLY = (arg: string, expected: string) =>
	`Argument '${arg}' expected ${expected}.`

const EXPECTED_GOT_REPLY = (arg: string, expected: string, got: string) =>
	`Argument '${arg}' expected ${expected}, but got '${got}'.`

const ID_NOT_FOUND_REPLY = (subject: string, id: string) =>
	`${subject} with ID '${id}' not found.`

export const parse = {
	string: ({ token }: ParserContext): string => token,

	number: ({ cmd, token, arg }: ParserContext): number | undefined => {
		if (!isNumeric(token)) {
			cmd.reply(EXPECTED_GOT_REPLY(arg.name, 'a number', token))
			return undefined
		}

		return Number(token)
	},

	user: ({ client, cmd, token, arg }: ParserContext): User | undefined => {
		if (!isUserMention(token)) {
			cmd.reply(EXPECTED_REPLY(arg.name, 'a user mention'))
			return undefined
		}

		const userId = token.replace(/[<@!>]/g, '')

		const user = client.users.cache.get(userId)
		if (!user) {
			cmd.reply(ID_NOT_FOUND_REPLY('User', userId))
			return undefined
		}

		return user
	},

	role: ({ cmd, token, arg }: ParserContext): Role | undefined => {
		if (!isRoleMention(token)) {
			cmd.reply(EXPECTED_REPLY(arg.name, 'a role mention'))
			return undefined
		}

		if (!cmd.guild) {
			cmd.reply(NO_GUILD_REPLY)
			return undefined
		}

		const roleId = token.replace(/<@&|>/g, '')
		const role = cmd.guild.roles.cache.get(roleId)

		if (!role) {
			cmd.reply(ID_NOT_FOUND_REPLY('Role', roleId))
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
			ctx.cmd.reply(EXPECTED_REPLY(ctx.arg.name, 'a user or role mention'))
			return undefined
		}
	},

	member: ({ cmd, token, arg }: ParserContext): GuildMember | undefined => {
		if (!isUserMention(token)) {
			cmd.reply(EXPECTED_REPLY(arg.name, 'a user mention'))
			return undefined
		}

		if (!cmd.guild) {
			cmd.reply(NO_GUILD_REPLY)
			return undefined
		}

		const userId = token.replace(/[<@!>]/g, '')
		const member = cmd.guild.members.cache.get(userId)

		if (!member) {
			cmd.reply(ID_NOT_FOUND_REPLY('Member', userId))
			return undefined
		}

		return member
	}
}
