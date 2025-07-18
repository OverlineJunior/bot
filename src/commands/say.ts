import { command, parse } from "../command"

export const sayCmd = command(
	'say',
	'Sends a message as the bot',
	[
		{ name: 'msg', description: 'Message to say', parser: parse.string }
	],
	(cmd, msg) => {
		cmd.reply(msg)
	},
)
