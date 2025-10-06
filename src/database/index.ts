import { JSONFilePreset } from 'lowdb/node'
import type { Warning } from './warningRepository'
import type { Xp } from './xpRepository'
import { Reminder } from './reminderRepository'

export interface Data {
	warnings: Warning[]
	xps: Xp[]
	reminders: Reminder[]
}

const defaultData: Data = {
	warnings: [],
	xps: [],
	reminders: [],
}

export const dbFile = await JSONFilePreset('./database.json', defaultData)

export * from './warningRepository'
export * from './xpRepository'
export * from './reminderRepository'
