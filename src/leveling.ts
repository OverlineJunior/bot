import { Client } from "discord.js"
import { incrementXp } from "./database"

export const level = (xp: number) => 1 + Math.floor(0.1 * Math.sqrt(xp))

export function nextLevelXp(xp: number): number {
	const currentLevel = level(xp)

	let high = xp > 1 ? xp * 2 : 100
	while (level(high) <= currentLevel) {
		high *= 2
	}

	let low = xp
	let result = high

	while (low <= high) {
		const mid = Math.floor(low + (high - low) / 2)

		if (level(mid) > currentLevel) {
			result = mid
			high = mid - 1
		} else {
			low = mid + 1
		}
	}

	return result
}

function startChatLeveling(client: Client) {
	client.on('messageCreate', async (msg) => {
		if (msg.author.bot) return

		const guildId = msg.guild?.id
		if (!guildId) return

		const memberId = msg.author.id

		await incrementXp(guildId, memberId, 10)
	})
}

function startVoiceLeveling(client: Client) {
	client.on('voiceStateUpdate', async (oldState, newState) => {
		if (oldState.member?.user.bot || newState.member?.user.bot) return

		const guildId = newState.guild.id

		const memberId = newState.member?.id
		if (!memberId) return

		if (newState.channelId && !oldState.channelId) {
			console.log(`User ${memberId} joined voice channel in guild ${guildId}`)
		} else if (!newState.channelId && oldState.channelId) {
			console.log(`User ${memberId} left voice channel in guild ${guildId}`)
		}
	})
}

export default function startLeveling(client: Client) {
	startChatLeveling(client)
	startVoiceLeveling(client)
}
