import { Client } from 'discord.js'
import { command, parse } from '../command'
import { NO_GUILD_REPLY, NOT_MEMBER_REPLY } from '../shared'

const VERIFIED_ROLE_NAME = 'Verificado'
const SUCCESS_REPLY = 'User has been verified successfully!'
const FAILURE_REPLY = 'Failed to verify user.'
const ROLE_NOT_FOUND_REPLY = (role: string) => `Role ´${role}´ not found. This is likely a bug.`
const DM = (guild: string) => `You have been verified in ${guild}. You can now access the verified channels.`

export default function startVerifyCmd(client: Client) {
	command(
		client,
		'verify',
		'Verify a user and give them the verified role',
		[
			{ name: 'member', description: 'Member to verify', parser: parse.member }
		],
		(cmd, member) => {
			const role = cmd.guild!.roles.cache.find(r => r.name === VERIFIED_ROLE_NAME)
			if (!role) {
				cmd.reply(ROLE_NOT_FOUND_REPLY(VERIFIED_ROLE_NAME))
				return
			}

			member.roles
				.add(role)
				.then(() => {
					cmd.reply(SUCCESS_REPLY)
					member.user.send(DM(cmd.guild!.name))
				})
				.catch(err => {
					console.log(`Error when trying to add role ´${role.name}´ to user ´${member.user.username}´: ${err}`)
					cmd.reply(FAILURE_REPLY)
					return
				})
		},
	)
}
