import { command } from "../command"

export const helpCmd = command(
	'help',
	'Show available commands',
	[],
	(cmd) => {
		cmd.reply('Available commands: help, say, kick, ban, unban, verify, dm')
	}
)
