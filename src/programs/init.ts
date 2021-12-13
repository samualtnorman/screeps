import { Creep, memoryCleaner, pixelGenerator, Room, Spawn } from "."
import { processes } from "../kernel"
import { log } from "../utils"

export function* init() {
	for (const name in Game.rooms)
		processes.add(Room(name))

	for (const name in Game.creeps)
		processes.add(Creep(name))

	for (const name in Game.spawns)
		processes.add(Spawn(name))

	processes.add(memoryCleaner())
	processes.add(pixelGenerator())

	log(`started ${processes.size} processes`)
}

export default init
