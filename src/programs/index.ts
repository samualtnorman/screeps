import { info } from "../utils"
import { processes } from "../kernel"
import { wait } from "./coroutines"

export * as creep from "./creep/index.ts_"
export * as room from "./room"
export * as spawn from "./spawn"

export function* memoryCleaner() {
	while (true) {
		yield* wait(1500)

		for (const name in Memory.creeps)
			if (!(name in Game.creeps))
				delete Memory.creeps[name]
	}
}

export function* pixelGenerator() {
	yield* wait(1)

	while (true) {
		if (Game.cpu.bucket == 10000) {
			Game.cpu.generatePixel()
			info("generated a pixel")
		} else {
			const ticks = Math.round((10000 - Game.cpu.bucket) / Game.cpu.limit)

			info(`waiting ${ticks} ticks (bucket: ${Game.cpu.bucket})`)

			yield* wait(ticks || 1)
		}

		yield
	}
}

export function* processCountLogger() {
	while (true) {
		yield* wait(10)

		info(`there are ${processes.size} processes`)
	}
}

export function* test() {

}
