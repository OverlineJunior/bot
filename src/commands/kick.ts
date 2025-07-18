import { Client } from "discord.js"
import { command, parse } from "../command"

const SUCCESS_REPLY = (user: string, reason: string) => `Kicked ${user} for: ${reason}`
const FAILURE_REPLY = "Failed to kick user"

export default function startKickCmd(client: Client) {
	command(
		client,
		'kick',
		'Kick a user from the server',
		[
			{ name: 'member', description: 'Member to kick', parser: parse.member },
			{ name: 'reason', description: 'Reason for kick', parser: parse.string }
		],
		(cmd, member, reason) => {
			member
				.kick(reason)
				.then(() => cmd.reply(SUCCESS_REPLY(member.user.tag, reason)))
				.catch(err => {
					console.error(`Failed to kick user ´${member.user.tag}´: ${err}`)
					cmd.reply(FAILURE_REPLY)
				})
		},
	)
}
