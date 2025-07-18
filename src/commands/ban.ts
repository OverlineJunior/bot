import { command, parse } from "../command"

const SUCCESS_REPLY = (user: string, reason: string) => `Banned ${user} for: ${reason}`
const FAILURE_REPLY = "Failed to ban user"

export const banCmd = command(
	'ban',
	'Ban a user from the server',
	[
		{ name: 'member', description: 'Member to ban', parser: parse.member },
		{ name: 'reason', description: 'Reason for ban', parser: parse.string }
	],
	(cmd, member, reason) => {
		member
			.ban({ reason })
			.then(() => cmd.reply(SUCCESS_REPLY(member.user.tag, reason)))
			.catch(err => {
				console.error(`Failed to ban user ´${member.user.tag}´: ${err}`)
				cmd.reply(FAILURE_REPLY)
			})
	}
)
