import { command, parse } from '../command'
import { addReminder, getReminders } from '../database'
import { beautifyMs } from '../shared'

const SUCCESS_REPLY = (user: string, time: number) => `Okay, I will remind ${user} in ${beautifyMs(time)}.`
const FAILURE_REPLY = 'Failed to set reminder'

export const remindersCmd = command(
	'reminders',
	'List all active reminders for a member',
	[
		{ name: 'member', description: 'Member to remind', parser: parse.member },
	],
	(cmd, member) => {
		const reminders = getReminders(cmd.guild!.id, member.id)

		if (reminders.length === 0) {
			cmd.reply(`${member.user.tag} has no active reminders.`)
			return
		}

		const reminderList = reminders
			.map(r => `- In ${beautifyMs(r.remindInMs)}: "${r.message}"`)
			.join('\n')

		cmd.reply(`${member.user.tag} has the following active reminders:\n${reminderList}`)
	},
)
