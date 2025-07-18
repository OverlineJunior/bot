import { Client } from "discord.js"
import { command, parse } from "../command"
import { NO_GUILD_REPLY, NOT_MEMBER_REPLY } from "../shared"

const SUCCESS_REPLY = (user: string, reason: string) => `Kicked ${user} for: ${reason}`
const FAILURE_REPLY = "Failed to kick user"

export default function startKickCmd(client: Client) {
	command(
		client,
		'kick',
		'Kick a user from the server',
		[
			{ name: 'user', description: 'User to kick', parser: parse.user },
			{ name: 'reason', description: 'Reason for kick', parser: parse.string }
		],
		(cmd, user, reason) => {
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
		},
	)
}
