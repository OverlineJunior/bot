import { command, parse } from '../command'
import { beautifyMs } from '../shared'

export const remindCmd = command(
	'remind',
	'Remind a member about something after a certain time',
	[
		{ name: 'member', description: 'Member to remind', parser: parse.member },
		{ name: 'time', description: 'When to remind', parser: parse.duration },
		{ name: 'message', description: 'Message to remind with', parser: parse.string },
	],
	(cmd, member, time, msg) => {
		// Add reminder to database and let the poller handle the rest.
		cmd.reply(`Okay, I will remind ${member} in ${beautifyMs(time)}.`)
	},
)

