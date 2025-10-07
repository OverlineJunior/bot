import { dbFile } from "./index"

export interface Reminder {
	id: string
	guildId: string
	memberId: string
	message: string
	timestamp: number
	remindInMs: number
}

export function getMemberReminders(guildId: string, memberId: string): Reminder[] {
	return dbFile.data.reminders.filter(r => r.guildId === guildId && r.memberId === memberId)
}

export async function addReminder(
	guildId: string,
	memberId: string,
	message: string,
	remindInMs: number
): Promise<Reminder> {
	const r: Reminder = {
		id: crypto.randomUUID(),
		guildId,
		memberId,
		message,
		timestamp: Date.now(),
		remindInMs,
	}

	await dbFile.update(({ reminders }) => reminders.push(r))
	return r
}

export async function removeReminder(id: string): Promise<Reminder> {
	const index = dbFile.data.reminders.findIndex(r => r.id === id)
	if (index === -1) {
		throw new Error(`Reminder with ID ${id} not found`)
	}

	const reminder = dbFile.data.reminders[index]
	await dbFile.update(({ reminders }) => reminders.splice(index, 1))
	return reminder
}
