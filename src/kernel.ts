import { mapError } from "./error-mapper"
import { error, info, warn } from "./utils"

/** holds currently active processes */
export const processes = new Set<Generator>()

/** holds processes to be run */
export const processQueue: Generator[] = []

/** when true, the current process the kernel is running will be terminated */
let exit = false

export function runProcess(process: Generator) {
	addProcess(process)

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

		processQueue.length = 0

		processQueue.push(...processes)

		for (const process of processQueue) {
			// when the bucket is full, we use all of our CPU (and a little bit of the bucket)
			// when the bucket is half full, we use half of the CPU, and the rest goes towards the bucket
			if (Game.cpu.getUsed() > Game.cpu.limit * (Game.cpu.bucket / 10000))
				break

			processes.delete(process)

			exit = false

			try {
				const { done, value } = process.next()

				if (!exit && !done) {
					processes.add(process)

					if (value)
						processQueue.push(process)
				}
			} catch (error_) {
				error(`error running process:\n${_.escape(mapError(error_))}`)
			}

			i++
		}

		info(`ran ${i} / ${size} processes (bucket: ${Game.cpu.bucket})`)
	} else
		warn("no processes to run")
}

Object.defineProperty(global, "listProcesses", {
	get() {

	}
})
