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

export function beautifyMs(ms: number): string {
	const units = [
		{ label: 'd', value: 86_400_000 },
		{ label: 'h', value: 3_600_000 },
		{ label: 'm', value: 60_000 },
		{ label: 's', value: 1_000 },
	]

	const parts: string[] = []
	let remaining = ms

	for (const unit of units) {
		const amount = Math.floor(remaining / unit.value)

		if (amount > 0) {
			parts.push(`${amount}${unit.label}`)
			remaining -= amount * unit.value
		}
	}

	return parts.length > 0 ? parts.join('') : '0s'
}
