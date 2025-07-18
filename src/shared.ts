export const NO_GUILD_REPLY = 'This command can only be used in a server.'
export const NOT_MEMBER_REPLY = 'User is not a member of this server.'

export function isUserMention(str: string): boolean {
	return /^<@!?(\d+)>$/.test(str)
}

export function isRoleMention(str: string): boolean {
	return /^<@&(\d+)>$/.test(str)
}

export function splitFirst(input: string, separator: string): [string, string] {
	const [first, ...rest] = input.split(separator)

	return [first, rest.join(separator)]
}

export function isNumeric(str: string): boolean {
	return !isNaN(Number(str)) && !isNaN(parseFloat(str))
}
