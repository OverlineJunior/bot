import { Role, User } from "discord.js"
import { command, parse } from "../command"

const SUCCESS_REPLY = "DM sent successfully!"
const FAILURE_REPLY = "Failed to send DM. Make sure the user has DMs enabled."
const DM = (sender: string, msg: string) => `DM from ${sender}: ${msg}`

export const dmCmd = command(
	'dm',
	'Send a DM to a user or all members of a role',
	[
		{ name: 'mention', description: 'User or role to DM', parser: parse.mention },
		{ name: 'msg', description: 'Message to send', parser: parse.string }
	],
	async (cmd, mention, msg) => {
		if (mention instanceof Role) {
			for (const member of mention.members.values()) {
				try {
					await member.send(DM(cmd.author.tag, msg))
				} catch { }
			}
		} else if (mention instanceof User) {
			try {
				await mention.send(DM(cmd.author.tag, msg))
			} catch (err) {
				cmd.reply(FAILURE_REPLY)
				return
			}
		}

		cmd.reply(SUCCESS_REPLY);
	}
)
