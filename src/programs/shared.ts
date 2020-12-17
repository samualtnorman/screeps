import { info } from "../utils"

export const processes = new Set<Generator>();
export const processQueue: Generator[] = [];

export function runProcess(process: Generator) {
	processes.add(process);

	if (!processQueue.includes(process))
		processQueue.push(process);
}

export function addProcess(process: Generator) {
	processes.add(process);
}

export function* memoryCleaner() {
	while (true) {
		yield* wait(1500)

		for (const name in Memory.creeps)
			if (!(name in Game.creeps))
				delete Memory.creeps[name]
	}
}

export function* pixelGenerator() {
	while (true) {
		const ticks = Math.round((10000 - Game.cpu.bucket) / Game.cpu.limit)

		info(`waiting ${ticks} ticks (bucket: ${Game.cpu.bucket})`)

		yield* wait(ticks)

		if (Game.cpu.bucket == 10000)
			Game.cpu.generatePixel()
	}
}

export function* processCountLogger() {
	while (true) {
		yield* wait(10)

		info(`there are ${processes.size} processes`)
	}
}

export function* wait(ticks: number) {
	const end = Game.time + Math.max(ticks, 1)

	while (Game.time < end)
		yield
}
