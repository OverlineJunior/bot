import { Client } from "discord.js"
import { command, parse } from "../command"

export default function startSayCmd(client: Client) {
	command(
		client,
		'say',
		'Sends a message as the bot',
		[
			{ name: 'msg', description: 'Message to say', parser: parse.string }
		],
		(cmd, msg) => {
			cmd.reply(msg)
		},
	)
}
