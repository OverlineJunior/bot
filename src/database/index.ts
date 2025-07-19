import { JSONFilePreset } from 'lowdb/node'
import type { Warning } from './warningRepository'
import type { Xp } from './xpRepository'

export interface Data {
	warnings: Warning[]
	xps: Xp[]
}

const defaultData: Data = {
	warnings: [],
	xps: []
}

export const dbFile = await JSONFilePreset('./database.json', defaultData)

export * from './warningRepository'
export * from './xpRepository'
