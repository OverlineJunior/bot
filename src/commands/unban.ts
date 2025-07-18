import { command, parse } from "../command"
import { NO_GUILD_REPLY } from "../shared"

// Unban may fail to return the user, so we use a generic `user`.
const SUCCESS_REPLY = (reason: string) => `Unbanned user for: ${reason}`
const FAILURE_REPLY = "Failed to ban user"
const DM = (guild: string, reason: string) => `You have been unbanned from ${guild} for: ${reason}`

export const unbanCmd = command(
	'unban',
	'Unban an user from the server',
	[
		{ name: 'user id', description: 'User ID to unban', parser: parse.string },
		{ name: 'reason', description: 'Reason for unban', parser: parse.string },
	],
	(cmd, userId, reason) => {
		if (!cmd.guild) {
			cmd.reply(NO_GUILD_REPLY)
			return
		}

		cmd.guild.members
			.unban(userId, reason)
			.then(user => {
				user
					?.send(DM(cmd.guild!.name, reason))
					.catch(() => console.log(`Failed to send unban DM to user of ID ${userId}`))

				cmd.reply(SUCCESS_REPLY(reason))
			})
			.catch(err => {
				console.error(`Failed to unban user with ID '${userId}': ${err}`)
				cmd.reply(FAILURE_REPLY)
			})
	},
)
