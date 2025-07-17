import { Client } from "discord.js"

const REPLIES = [
	{
		pattern: /(oi|olá|bonjour)[, ]*capeta/i,
		replies: ['Fala meu demonião 😈', 'Aoba Belzebu 👹']
	},
]

function findReply(msg: string): string | undefined {
	for (const { pattern, replies } of REPLIES) {
		if (pattern.test(msg)) {
			return replies[Math.floor(Math.random() * replies.length)]
		}
	}

	return undefined
}

export default function startAutoReply(client: Client) {
	client.on('messageCreate', async (msg) => {
		if (msg.author.bot) return

		const reply = findReply(msg.content)
		if (reply) {
			await msg.reply(reply)
		}
	})
}
