import { Client } from 'discord.js'
import { command, parse } from '../command'

const VERIFIED_ROLE_NAME = 'Verificado'
const SUCCESS_REPLY = 'User has been verified successfully!'
const FAILURE_REPLY = 'Failed to verify user.'
const NO_MENTION_REPLY = 'Please mention a user to verify.'
const NO_SERVER_REPLY = 'This command can only be used in a server.'
const ROLE_NOT_FOUND_REPLY = (role: string) => `Role ´${role}´ not found. This is likely a bug.`
const NOT_MEMBER_REPLY = 'User is not a member of this server.'
const DM = (guild: string) => `You have been verified in ${guild}. You can now access the verified channels.`

export default function startVerifyCmd(client: Client) {
	command(client, 'verify', (cmd, user) => {
		if (!user) {
			cmd.reply(NO_MENTION_REPLY)
			return
		}

		if (!cmd.guild) {
			cmd.reply(NO_SERVER_REPLY)
			return
		}

		const role = cmd.guild.roles.cache.find(r => r.name === VERIFIED_ROLE_NAME)
		if (!role) {
			cmd.reply(ROLE_NOT_FOUND_REPLY(VERIFIED_ROLE_NAME))
			return
		}

		const member = cmd.guild.members.cache.get(user.id)
		if (!member) {
			cmd.reply(NOT_MEMBER_REPLY)
			return
		}

		member.roles
			.add(role)
			.then(() => {
				cmd.reply(SUCCESS_REPLY)
				user.send(DM(cmd.guild!.name))
			})
			.catch(err => {
				console.log(`Error when trying to add role ´${role.name}´ to user ´${user.username}´: ${err}`)
				cmd.reply(FAILURE_REPLY)
				return
			})
	}, [parse.user])
}
