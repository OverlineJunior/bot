import { Client } from "discord.js"
import { command } from "../command"

export default function startHelpCmd(client: Client) {
	command(client, 'help', (cmd) => {
		cmd.reply('Available commands: help, say, kick, ban, unban, verify, dm')
	})
}
