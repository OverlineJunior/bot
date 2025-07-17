import 'dotenv/config'
import { Client } from 'discord.js'
import startAutoReply from './autoReply'
import startCommands from './commands'

const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent'],
})

startAutoReply(client)
startCommands(client)

client.login(process.env.TOKEN)
