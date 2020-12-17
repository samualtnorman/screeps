import { info, warn } from "./utils"
import { sourceMappedStackTrace } from "./lib"
import { Creep, memoryCleaner, pixelGenerator, Room, Spawn } from "./programs"
import { processQueue, processes, addProcess } from "./kernel"

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

export function loop() {
	const { size } = processes

	if (size) {
		let i = 0

		// code that runs in between calls to loop() might be
		// able to insert processes to run first in a tick
		processQueue.push(...processes)

		while (processQueue.length) {
			if (Game.cpu.getUsed() > Game.cpu.limit * (Game.cpu.bucket / 10000)) {
				processQueue.length = 0
				info(`ran ${i} / ${size} processes (bucket: ${Game.cpu.bucket})`)
				return
			}

			const process = processQueue.shift()!

			processes.delete(process)

			try {
				const { done, value } = process.next()

				if (!done) {
					processes.add(process)

					if (value)
						processQueue.push(process)
				}
			} catch (error) {
				error(`error running process:\n${_.escape(sourceMappedStackTrace(error))}`)
			}

			i++
		}

		processQueue.length = 0
	} else
		warn("no processes to run")
}
