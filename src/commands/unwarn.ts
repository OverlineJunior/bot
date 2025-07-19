import { command, parse } from "../command"
import { removeWarning } from "../database"

const SUCCESS_REPLY = (user: string, reason: string) => `Removed warning from ${user} for: ${reason}`
const FAILURE_REPLY = "Failed to remove warning from user"
const DM = (guild: string, removalReason: string, warningReason: string) =>
	`Your warning from ${guild} has been removed for: ${removalReason}\n
Warning reason was: ${warningReason}`

export const unwarnCmd = command(
	'unwarn',
	'Remove a warning from a user',
	[
		{ name: 'warning id', description: 'ID of the warning to remove', parser: parse.string },
		{ name: 'reason', description: 'Reason for removing the warning', parser: parse.string },
	],
	(cmd, warningId, reason) => {
		removeWarning(warningId)
			.then(warning => {
				const member = cmd.guild?.members.cache.get(warning.memberId)
				if (member) {
					member
						.send(DM(cmd.guild!.name, reason, warning.reason))
						.catch(() => console.log(`Failed to send unwarn DM to ${member.user.tag}`))
				}

				cmd.reply(SUCCESS_REPLY(member?.user.tag ?? 'Unknown user', reason))
			})
			.catch(err => {
				console.error(`Failed to remove warning with ID '${warningId}': ${err}`)
				cmd.reply(FAILURE_REPLY)
			})
	}
)
