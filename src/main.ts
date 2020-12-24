import {
	Creep, Room, Spawn, memoryCleaner, pixelGenerator, test
} from "./programs"

import { addProcess, processes, tick } from "./kernel"
import { info } from "./utils"
import { wrap } from "./error-mapper"

for (const name in Game.rooms)
	addProcess(Room(name))

for (const name in Game.creeps)
	addProcess(Creep(name))

for (const name in Game.spawns)
	addProcess(Spawn(name))

addProcess(memoryCleaner())
addProcess(pixelGenerator())
// addProcess(programs.processCount())
addProcess(test())

info(`started ${processes.size} processes`)

export const loop = wrap(tick)
