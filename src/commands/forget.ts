import { command, parse } from '../command'
import { addReminder, removeReminder } from '../database'
import { beautifyMs } from '../shared'

const SUCCESS_REPLY = (user: string) => `Okay, I have forgotten ${user}'s remind.`
const FAILURE_REPLY = 'Failed to forget reminder'

export const forgetCmd = command(
	'forget',
	'Forget a reminder by its ID',
	[
		{ name: 'id', description: 'Reminder ID to forget', parser: parse.string },
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
