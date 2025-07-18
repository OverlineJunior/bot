import { command, parse } from "../command"
import { db, Warning } from "../database"

const NO_WARNINGS_REPLY = "This member has no warnings."
// The string must be indented to the left for correct formatting in Discord.
const WARNING_PATTERN = (warning: Warning) =>
`\nID: ${warning.id},
Reason: ${warning.reason},
Date: <t:${Math.floor(warning.timestamp / 1000)}:f>`
const SUCCESS_REPLY = (member: string, warningList: string) =>
	`Warnings for ${member}:\n${warningList}`

export const warningsCmd = command(
	'warnings',
	'List warnings for a member',
	[
		{ name: 'member', description: 'Member to list warnings for', parser: parse.member },
	],
	(cmd, member) => {
		const warnings = db.getWarnings(cmd.guild!.id, member.id)
		if (warnings.length === 0) {
			cmd.reply(NO_WARNINGS_REPLY)
			return
		}

		const warningList = warnings.map(WARNING_PATTERN).join('\n')
		cmd.reply(SUCCESS_REPLY(member.user.tag, warningList))
	}
)
