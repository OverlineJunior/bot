import { banCmd } from './ban'
import { dmCmd } from './dm'
import { forgetCmd } from './forget'
import { helpCmd } from './help'
import { kickCmd } from './kick'
import { remindCmd } from './remind'
import { remindersCmd } from './reminders'
import { sayCmd } from './say'
import { unbanCmd } from './unban'
import { unwarnCmd } from './unwarn'
import { verifyCmd } from './verify'
import { warnCmd } from './warn'
import { warningsCmd } from './warnings'
import { xpCmd } from './xp'

export const COMMAND_PREFIX = '?'

export const commands = [
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
	remindCmd,
	remindersCmd,
	forgetCmd,
]
