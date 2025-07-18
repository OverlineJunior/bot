import { command, parse } from "../command"

const SUCCESS_REPLY = (user: string, reason: string) => `Banned ${user} for: ${reason}`
const FAILURE_REPLY = "Failed to ban user"
const DM = (guild: string, reason: string) => `You have been banned from ${guild} for: ${reason}`

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
			.then(() => {
				member.send(DM(cmd.guild!.name, reason))
				cmd.reply(SUCCESS_REPLY(member.user.tag, reason))
			})
			.catch(err => {
				console.error(`Failed to ban user ´${member.user.tag}´: ${err}`)
				cmd.reply(FAILURE_REPLY)
			})
	}
)
