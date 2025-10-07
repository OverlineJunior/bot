import { command, parse } from '../command'
import { getMemberReminders } from '../database'
import { beautifyMs } from '../shared'

const SUCCESS_REPLY = (user: string, reminderList: string) => `:gs_star: ${user} tem os seguintes lembretes ativos:\n${reminderList}`
const NO_REMINDERS_REPLY = (user: string) => `:gs_star: ${user} não tem nenhum lembrete.`

export const remindersCmd = command(
	'reminders',
	'Lista todos os lembretes de uma úsuaria',
	[
		{ name: 'member', description: 'Membra a verificar os ', parser: parse.member },
	],
	(cmd, member) => {
		const reminders = getMemberReminders(cmd.guild!.id, member.id)

		if (reminders.length === 0) {
			cmd.reply(NO_REMINDERS_REPLY(member.user.tag))
			return
		}

		const reminderList = reminders
			.map(r => `- In ${beautifyMs(r.remindInMs)}: "${r.message}" ||(ID: ${r.id})||`)
			.join('\n')

		cmd.reply(SUCCESS_REPLY(member.user.tag, reminderList))
	},
)
