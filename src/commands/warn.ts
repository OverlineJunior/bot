import { command, parse } from "../command"
import { db } from "../database"

const SUCCESS_REPLY = (user: string, reason: string) => `Warned ${user} for: ${reason}`
const FAILURE_REPLY = "Failed to warn user"
const DM = (guild: string, reason: string) => `You received a warning from ${guild} for: ${reason}`

export const warnCmd = command(
	'warn',
	'Warn a user about something',
	[
		{ name: 'member', description: 'The member to warn', parser: parse.member },
		{ name: 'reason', description: 'The reason for the warning', parser: parse.string },
	],
	(cmd, member, reason) => {
		db
			.addWarning(cmd.guild!.id, member.id, reason)
			.then(() => {
				member
					.send(DM(cmd.guild!.name, reason))
					.catch(() => console.log(`Failed to send warning DM to ${member.user.tag}`))

				cmd.reply(SUCCESS_REPLY(member.user.tag, reason))
			})
			.catch(err => {
				console.error(`Failed to warn user '${member.user.tag}': ${err}`)
				cmd.reply(FAILURE_REPLY)
			})
	},
)
