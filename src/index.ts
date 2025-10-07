import 'dotenv/config'
import { Client } from 'discord.js'
import startAutoReply from './autoReply'
import { startCommands } from './command'
import startLeveling from './leveling'
import { startReminderPoller } from './reminderPoller'
import { COMMAND_PREFIX, commands } from './commands'

const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent', 'GuildVoiceStates'],
})

startAutoReply(client)
startLeveling(client)
startReminderPoller(client)

startCommands(client, COMMAND_PREFIX, commands)

client.login(process.env.TOKEN)
