import { error, info, warn } from "./utils"
import { mapError } from "./error-mapper"

export type Process = Generator<YieldCode | void, void, void>

/**
 * various codes the kernel recognises
 *
 * only works with the `yield` keyword, not `return`
 */
export enum YieldCode {
	/**
	 * runs the process again next tick
	 */
	OK,
	/**
	 * runs the process again in the same tick if possible
	 */
	Again,
	/**
	 * stops the process, useful within coroutines
	 */
	Stop
}

export const processes = new Set<Process>()
export const processQueue: Process[] = []

export function runProcess(process: Process) {
	processes.add(process)
	processQueue.push(process)
}

export function addProcess(process: Process) {
	processes.add(process)
}

export function tick() {
	const { size } = processes

	if (size) {
		let i = 0

		processQueue.push(...processes)

		for (const process of processQueue) {
			if (
				Game.cpu.getUsed() > Game.cpu.limit * (Game.cpu.bucket / 10000)
			) {
				info(
					`ran ${i} / ${size} processes (bucket: ${Game.cpu.bucket})`
				)
				break
			}

			processes.delete(process)

			try {
				const { done, value } = process.next()

				if (!done) {
					switch (value) {
						default:
						case YieldCode.OK:
							processes.add(process)
							break

						case YieldCode.Again:
							processQueue.push(process)
							break

						case YieldCode.Stop:
							process.return()
							break
					}
				}
			} catch (error_) {
				error(`error running process:\n${_.escape(mapError(error_))}`)
			}

			i++
		}
	} else
		warn("no processes to run")
}
