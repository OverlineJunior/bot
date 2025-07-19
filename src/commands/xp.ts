import { command, parse } from "../command"
import { getXp } from "../database"
import { level, nextLevelXp } from "../leveling"

export const xpCmd = command(
	'xp',
	'Get the XP of a member',
	[
		{ name: 'member', description: 'The member to check XP for', parser: parse.member },
	],
	(cmd, member) => {
		const xp = getXp(cmd.guild!.id, member.id)
		cmd.reply(`${member} is at level ${level(xp)} with ${xp}/${nextLevelXp(xp)}xp.`)
	},
)
