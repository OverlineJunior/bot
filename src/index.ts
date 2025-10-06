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
import { warningsCmd } from './commands/warnings'
import { unwarnCmd } from './commands/unwarn'
import startLeveling from './leveling'
import { xpCmd } from './commands/xp'

const client = new Client({
	intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent', 'GuildVoiceStates'],
})

startAutoReply(client)
startLeveling(client)

startCommands(client, [
	dmCmd,
	verifyCmd,
	kickCmd,
	sayCmd,
	banCmd,
	helpCmd,
	unbanCmd,
	warnCmd,
	warningsCmd,
	unwarnCmd,
	xpCmd,
])

client.login(process.env.TOKEN)
