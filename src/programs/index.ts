import { processes } from "../kernel"
import { info } from "../utils"

export * from "./Creep"
export * from "./Room"
export * from "./Spawn"

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

			info("generated a pixel")

			yield
		} else {
			const ticks = Math.round((10000 - Game.cpu.bucket) / Game.cpu.limit)

			info(`waiting ${ticks} ticks (bucket: ${Game.cpu.bucket})`)

			yield* wait(ticks)
		}
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

export function* test() {

}
