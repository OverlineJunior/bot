import { Client } from "discord.js"
import { command, parse } from "../command"
import { NO_GUILD_REPLY, NOT_MEMBER_REPLY } from "../shared"

const DEFAULT_REASON = "No reason provided"
const SUCCESS_REPLY = (user: string, reason: string) => `Kicked ${user} for: ${reason}`
const FAILURE_REPLY = "Failed to kick user"
const NO_USER_REPLY = "You must mention a user to kick."

export default function startKickCmd(client: Client) {
	command(client, 'kick', (cmd, user, reason) => {
		if (!user) {
			cmd.reply(NO_USER_REPLY)
			return
		}

		reason = reason ?? DEFAULT_REASON

		if (!cmd.guild) {
			cmd.reply(NO_GUILD_REPLY)
			return
		}

		const member = cmd.guild.members.cache.get(user.id)
		if (!member) {
			cmd.reply(NOT_MEMBER_REPLY)
			return
		}

		member
			.kick(reason)
			.then(() => cmd.reply(SUCCESS_REPLY(user.tag, reason)))
			.catch(err => {
				console.error(`Failed to kick user ´${user.tag}´: ${err}`)
				cmd.reply(FAILURE_REPLY)
			})
	}, [parse.user, parse.string])
}
