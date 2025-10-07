import { command, parse } from '../command'
import { addReminder } from '../database'
import { beautifyMs } from '../shared'

const SUCCESS_REPLY = (user: string, time: number) => `:gs_abyes: Ok! Eu vou lembrar ${user} em ${beautifyMs(time)} da interação dela.`
const FAILURE_REPLY = ':gs_abno: Erro ao setar o comando'

export const remindCmd = command(
	'remind',
	'Criar um lembrete',
	[
		{ name: 'member', description: 'Membra a ser marcada no lembrete', parser: parse.member },
		{ name: 'time', description: 'Quando lembrar', parser: parse.duration },
		{ name: 'message', description: 'Mensagem do lembrete', parser: parse.string },
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
