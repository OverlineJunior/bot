import 'dotenv/config'
import { Client } from 'discord.js'
import startAutoReply from './autoReply'
import { startCommands } from './command'
import { banCmd } from './commands/ban'
import { dmCmd } from './commands/dm'
import { helpCmd } from './commands/help'
import { kickCmd } from './commands/kick'
import { sayCmd } from './commands/say'
import { verifyCmd } from './commands/verify'
import { unbanCmd } from './commands/unban'
import { warnCmd } from './commands/warn'

const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent'],
})

startAutoReply(client)

startCommands(client, [
	dmCmd,
	verifyCmd,
	kickCmd,
	sayCmd,
	banCmd,
	helpCmd,
	unbanCmd,
	warnCmd,
])

client.login(process.env.TOKEN)
