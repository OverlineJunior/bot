import { JSONFilePreset } from 'lowdb/node'
import type { Warning } from './warningRepository'

export interface Data {
	warnings: Warning[]
}

const defaultData: Data = {
	warnings: [],
}

export const dbFile = await JSONFilePreset('./database.json', defaultData)
