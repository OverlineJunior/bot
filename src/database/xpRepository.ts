import { dbFile } from "./data"

export interface Xp {
	guildId: string
	memberId: string
	value: number
}

export function getXp(guildId: string, memberId: string): number {
	const xp = dbFile.data.xps
		.find(x => x.guildId === guildId && x.memberId === memberId)

	return xp?.value ?? 0
}

export async function setXp(guildId: string, memberId: string, value: number): Promise<void> {
	if (value < 0) {
		throw new Error(`Expected positive XP value, got ${value}`)
	}

	await dbFile.update(({ xps }) => {
		const xp = xps.find(x => x.guildId === guildId && x.memberId === memberId)

		if (xp) {
			xp.value = value
		} else {
			xps.push({ guildId, memberId, value })
		}
	})
}

export async function incrementXp(guildId: string, memberId: string, amount: number): Promise<void> {
	// Does not reuse getXp and setXp for atomicity, avoiding possible race conditions.
	await dbFile.update(({ xps }) => {
		const xp = xps.find(x => x.guildId === guildId && x.memberId === memberId)
		if (xp) {
			xp.value += amount
		} else {
			xps.push({ guildId, memberId, value: Math.max(0, amount) })
		}
	})
}
