import { processes } from "../kernel"
import { log } from "../utils"

export { Creep } from "./Creep"
export { Room } from "./Room"
export { Spawn } from "./Spawn"

export function* memoryCleaner() {
	while (true) {
		yield* wait(1500)

		for (const name in Memory.creeps)
			if (!(name in Game.creeps))
				delete Memory.creeps[name]
	}
}

export function* pixelGenerator() {
	yield

	while (true) {
		if (Game.cpu.bucket == 10000) {
			Game.cpu.generatePixel()

			log("generated a pixel")

			yield
		} else {
			const ticks = Math.round((10000 - Game.cpu.bucket) / Game.cpu.limit)

			log(`waiting ${ticks} ticks (bucket: ${Game.cpu.bucket})`)

			yield* wait(ticks)
		}
	}
}

export function* processCountLogger() {
	while (true) {
		yield* wait(10)

		log(`there are ${processes.size} processes`)
	}
}

export function* wait(ticks: number) {
	const end = Game.time + Math.max(ticks, 1)

	while (Game.time < end)
		yield
}
