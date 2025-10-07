import { Client } from "discord.js"
import { getAllReminders, removeReminder } from "./database"
import { botLog } from "./logger"

const POLL_INTERVAL_MS = 1000
const REMINDER_DM = (message: string) => `:gs_aseta: Lembrete: "${message}"`

export async function startReminderPoller(client: Client) {
	async function poll() {
		const now = Date.now()

		getAllReminders().forEach(async (reminder) => {
			const elapsed = now - reminder.timestamp

			if (elapsed >= reminder.remindInMs) {
				try {
					const guild = await client.guilds.fetch(reminder.guildId)
					const member = await guild.members.fetch(reminder.memberId)
					await member.send(REMINDER_DM(reminder.message))
					botLog(client, `Sent a reminder to ${member.user.tag}: ${reminder.message}`)

					await removeReminder(reminder.id)
				} catch (error) {
					console.error(`Failed to send reminder to member ${reminder.memberId} in guild ${reminder.guildId}:`, error)
				}
			}
		})

		setTimeout(poll, POLL_INTERVAL_MS)
	}

	poll()
}
