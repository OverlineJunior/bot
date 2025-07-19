import { dbFile } from "./data"

export interface Warning {
	id: string
	guildId: string
	memberId: string
	reason: string
	timestamp: number
}

export function getWarnings(guildId: string, memberId: string): Warning[] {
	return dbFile.data.warnings.filter(w => w.guildId === guildId && w.memberId === memberId)
}

export async function addWarning(guildId: string, memberId: string, reason: string): Promise<Warning> {
	const w: Warning = {
		id: crypto.randomUUID(),
		guildId,
		memberId,
		reason,
		timestamp: Date.now(),
	}

	await dbFile.update(({ warnings }) => warnings.push(w))
	return w
}

export async function removeWarning(id: string): Promise<Warning> {
	const index = dbFile.data.warnings.findIndex(w => w.id === id)
	if (index === -1) {
		throw new Error(`Warning with ID ${id} not found`)
	}

	const warning = dbFile.data.warnings[index]
	await dbFile.update(({ warnings }) => warnings.splice(index, 1))
	return warning
}

export async function clearWarnings(guildId: string, memberId: string): Promise<void> {
	await dbFile.update(({ warnings }) => {
		const filtered = warnings.filter(w => !(w.guildId === guildId && w.memberId === memberId))
		// We set the length instead of reassigning to mutate the original array.
		warnings.length = 0
		warnings.push(...filtered)
	})
}
