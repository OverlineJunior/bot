import 'dotenv/config'
import { Client } from 'discord.js'
import startAutoReply from './autoReply'
import { startCommands } from './command'
import startLeveling from './leveling'
import { startReminderPoller } from './reminderPoller'
import { commands } from './commands'

const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent', 'GuildVoiceStates'],
})

startAutoReply(client)
startLeveling(client)
startReminderPoller(client)

startCommands(client, commands)

client.login(process.env.TOKEN)
