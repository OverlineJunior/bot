import { Client, Role, User } from "discord.js"
import { command } from "../command"

const SUCCESS_REPLY = "DM sent successfully!"
const FAILURE_REPLY = "Failed to send DM. Make sure the user has DMs enabled."
const NO_MENTION_REPLY = "Please mention a user or role to DM."
const NO_MESSAGE_REPLY = "Please provide a message to send."
const DM_PATTERN = (sender: string, msg: string) => `DM from ${sender}: ${msg}`

export default function startDmCmd(client: Client) {
	command(client, 'dm', async (cmd, _, msg) => {
		const mention = cmd.mentions.users.first() || cmd.mentions.roles.first()

		if (!mention) {
			cmd.reply(NO_MENTION_REPLY)
			return
		}

		if (!msg) {
			cmd.reply(NO_MESSAGE_REPLY)
			return
		}

		if (mention instanceof Role) {
			for (const member of mention.members.values()) {
				try {
					await member.send(DM_PATTERN(cmd.author.tag, msg))
				} catch { }
			}
		} else if (mention instanceof User) {
			try {
				await mention.send(DM_PATTERN(cmd.author.tag, msg))
			} catch (err) {
				cmd.reply(FAILURE_REPLY)
				return
			}
		}

		cmd.reply(SUCCESS_REPLY);
	})
}
