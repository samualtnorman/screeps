import init from "./programs/init"
import { log, mapError } from "./utils"

/** holds currently active processes */
export const processes = new Set<Generator>([ init() ])

/** holds processes to be run */
export const processQueue: Generator[] = []

/** when true, the current process the kernel is running will be terminated */
let exit = false

export function runProcess(process: Generator) {
	processes.add(process)

	if (!processQueue.includes(process))
		processQueue.push(process)
}

export function stop() {
	exit = true
}

export function tick() {
	log(`tick: ${Game.time}`)

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
				log.error(`error running process:\n${_.escape(error_ instanceof Error ? mapError(error_) : String(error_))}`)
			}

			i++
		}

		log(`ran ${i} / ${size} processes (bucket: ${Game.cpu.bucket})`)
	} else {
		log.error("all the processes died")
		processes.add(init())
	}
}

// Object.defineProperty(global, "listProcesses", {
// 	get() {
// 		console.log("hello")
// 	}
// })

// console.log(typeof global)
