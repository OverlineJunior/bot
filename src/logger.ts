import { Client, TextChannel } from "discord.js"

const LOG_CHANNEL_ID = '1425199595092312185'

export function botLog(client: Client, message: string) {
	client.channels.fetch(LOG_CHANNEL_ID)
		.then(channel => {
			if (channel && channel instanceof TextChannel) {
				channel.send(`[LOG] ${message}`)
			}
		})
		.catch(err => {
			console.error(`Failed to log message to channel ${LOG_CHANNEL_ID}:`, err)
		})
}
