import { Client } from "discord.js"
import startDmCmd from "./dm"
import startVerifyCmd from "./verify"
import startKickCmd from "./kick"
import startSayCmd from "./say"
import startBanCmd from "./ban"
import startUnbanCmd from "./unban"

export default function startCommands(client: Client) {
	startDmCmd(client)
	startVerifyCmd(client)
	startKickCmd(client)
	startSayCmd(client)
	startBanCmd(client)
	startUnbanCmd(client)
}
