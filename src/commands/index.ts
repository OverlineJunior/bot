import { Client } from "discord.js"
import startDmCmd from "./dm"

export default function startCommands(client: Client) {
	startDmCmd(client)
}
