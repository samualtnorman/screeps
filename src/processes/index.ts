import { info } from "../utils"
import { processes } from "./processes"
import { Creep, memoryCleaner, pixelGenerator, Room, Spawn } from "./programs"
import { addProcess } from "./runProcess"

for (const name in Game.rooms)
	addProcess(Room(name))

for (const name in Game.creeps)
	addProcess(Creep(name))

for (const name in Game.spawns)
	addProcess(Spawn(name))

addProcess(memoryCleaner())
addProcess(pixelGenerator())
// addProcess(programs.processCount())

info(`started ${processes.size} processes`)
