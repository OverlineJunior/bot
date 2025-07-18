import { Client } from "discord.js"
import { command, parse } from "../command"

const NO_MSG_REPLY = 'Please provide a message to say.'

export default function startSayCmd(client: Client) {
	command(client, 'say', (cmd, msg) => {
		if (!msg) {
			cmd.reply(NO_MSG_REPLY)
			return
		}

		cmd.reply(msg)
	}, [parse.string])
}
