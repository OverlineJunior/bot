import { command, parse } from '../command'
import { addReminder, getReminders } from '../database'
import { beautifyMs } from '../shared'

const SUCCESS_REPLY = (user: string, reminderList: string) => `${user} has the following active reminders:\n${reminderList}`
const NO_REMINDERS_REPLY = (user: string) => `${user} has no active reminders.`

export const remindersCmd = command(
	'reminders',
	'List all active reminders for a member',
	[
		{ name: 'member', description: 'Member to remind', parser: parse.member },
	],
	(cmd, member) => {
		const reminders = getReminders(cmd.guild!.id, member.id)

		if (reminders.length === 0) {
			cmd.reply(NO_REMINDERS_REPLY(member.user.tag))
			return
		}

		const reminderList = reminders
			.map(r => `- In ${beautifyMs(r.remindInMs)}: "${r.message}"`)
			.join('\n')

		cmd.reply(SUCCESS_REPLY(member.user.tag, reminderList))
	},
)
