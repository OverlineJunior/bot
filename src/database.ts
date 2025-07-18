import { JSONFilePreset } from 'lowdb/node'

export interface Warning {
	id: string
	guildId: string
	memberId: string
	reason: string
	timestamp: number
}

export interface Data {
	warnings: Warning[]
}

const defaultData: Data = {
	warnings: [],
}

const file = await JSONFilePreset('./database.json', defaultData)

export const db = {
	getWarnings: (guildId: string, memberId: string): Warning[] =>
		file.data.warnings.filter(w => w.guildId === guildId && w.memberId === memberId),

	addWarning: async (guildId: string, memberId: string, reason: string): Promise<Warning> => {
		const w: Warning = {
			id: crypto.randomUUID(),
			guildId,
			memberId,
			reason,
			timestamp: Date.now(),
		}

		await file.update(({ warnings }) => warnings.push(w))
		return w
	},

	removeWarning: async (id: string): Promise<Warning> => {
		const index = file.data.warnings.findIndex(w => w.id === id)
		if (index === -1) {
			throw new Error(`Warning with ID ${id} not found`)
		}

		const warning = file.data.warnings[index]
		await file.update(({ warnings }) => warnings.splice(index, 1))
		return warning
	},

	clearWarnings: async (guildId: string, memberId: string): Promise<void> => {
		await file.update(({ warnings }) => {
			const filtered = warnings.filter(w => !(w.guildId === guildId && w.memberId === memberId))
			// We set the length instead of reassigning to mutate the original array.
			warnings.length = 0
			warnings.push(...filtered)
		})
	},
}
