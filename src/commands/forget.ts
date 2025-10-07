import { command, parse } from '../command'
import { addReminder, removeReminder } from '../database'
import { beautifyMs } from '../shared'

const SUCCESS_REPLY = (user: string) => `:gg_sim: Ok! Eu vou esquecer do lembrete da ${user}.`
const FAILURE_REPLY = ':gg_nao: Erro ao esquecer o lembrete'

export const forgetCmd = command(
	'forget',
	'Esquece de um lembrete pelo seu ID',
	[
		{ name: 'id', description: 'ID do lembrete a ser esquecido', parser: parse.string },
	],
	(cmd, id) => {
		// Remove reminder from database and let the poller handle the rest.
		removeReminder(id)
			.then(() => cmd.reply(SUCCESS_REPLY(cmd.member!.user.tag)))
			.catch(err => {
				console.error(`Failed to remove reminder '${id}': ${err}`)
				cmd.reply(FAILURE_REPLY)
			})
	},
)
