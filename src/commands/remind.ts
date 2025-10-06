import { command, parse } from '../command'
import { addReminder } from '../database'
import { beautifyMs } from '../shared'

const SUCCESS_REPLY = (user: string, time: number) => `Okay, I will remind ${user} in ${beautifyMs(time)}.`
const FAILURE_REPLY = 'Failed to set reminder'

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
		addReminder(cmd.guild!.id, member.id, msg, time)
			.then(() => cmd.reply(SUCCESS_REPLY(member.user.tag, time)))
			.catch(err => {
				console.error(`Failed to add reminder for '${member.user.tag}': ${err}`)
				cmd.reply(FAILURE_REPLY)
			})
	},
)
