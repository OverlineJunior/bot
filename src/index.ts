import 'dotenv/config'
import { ChannelType, Client } from 'discord.js'

const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent'],
})

client.on('ready', async (c) => {
	const channel = await c.channels.fetch('1395225572162011387')

	if (channel?.type === ChannelType.GuildText) {
		channel.send('Hello, world!')
	} else {
		console.error('Channel not found or is not a text channel.')
	}
})

client.login(process.env.TOKEN)
