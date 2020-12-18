import { mapError } from "./error-mapper"
import { error, info, warn } from "./utils"

export const processes = new Set<Generator>()
export const processQueue: Generator[] = []

let exit = false

export function runProcess(process: Generator) {
	processes.add(process)

	if (!processQueue.includes(process))
		processQueue.push(process)
}

export function addProcess(process: Generator) {
	processes.add(process)
}

export function stop() {
	exit = true
}

export function tick() {
	const { size } = processes

	if (size) {
		let i = 0

		// code that runs in between calls to loop() might be
		// able to insert processes to run first in a tick
		processQueue.push(...processes)

		for (const process of processQueue) {
			if (Game.cpu.getUsed() > Game.cpu.limit * (Game.cpu.bucket / 10000)) {
				info(`ran ${i} / ${size} processes (bucket: ${Game.cpu.bucket})`)
				break
			}

			processes.delete(process)

			try {
				const { done, value } = process.next()

				if (exit) {
					exit = false
				} else if (!done) {
					processes.add(process)

					if (value)
						processQueue.push(process)
				}
			} catch (error_) {
				error(`error running process:\n${_.escape(mapError(error_))}`)
			}

			i++
		}

		processQueue.length = 0
	} else
		warn("no processes to run")
}
