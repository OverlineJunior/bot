import { Client } from "discord.js"
import { incrementXp } from "./database"

export default function startLeveling(client: Client) {
	client.on('messageCreate', async (msg) => {
		if (msg.author.bot) return

		const guildId = msg.guild?.id
		if (!guildId) return

		const memberId = msg.author.id

		await incrementXp(guildId, memberId, 10)
	})
}
