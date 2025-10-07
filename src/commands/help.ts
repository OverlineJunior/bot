import { COMMAND_PREFIX, commands } from "."
import { AnyCommand, command } from "../command"

export const helpCmd = command(
	'help',
	'Show available commands',
	[],
	(cmd) => {
		const argList = (c: AnyCommand) => c.arguments_
			.map(a => `  - *${a.name}*: ${a.description}`)
			.join('\n')

		const cmdList = commands
			.map(c => `- **${COMMAND_PREFIX}${c.name}**: ${c.description}\n${argList(c)}`)
			.join('\n\n')

		cmd.reply(`Available commands:\n\n${cmdList}`)
	}
)
