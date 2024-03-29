import { wait, Creep } from "."
import { Returns, log } from "../utils"
import { runProcess, processes } from "../kernel"

export function* Spawn(name: string) {
	let spawn

	// TODO be able to request energy so creeps focus on what's important

	while (spawn = Game.spawns[name]) {
		if (spawn.room.find(FIND_MY_CREEPS).length < 5) {
			const name = Game.time.toString(36)
			const returnCode = spawn.spawnCreep([ WORK, CARRY, MOVE ], name, { memory: { origin: spawn.room.name } })

			switch (returnCode) {
				case OK:
					yield* wait(3 * 4)

					runProcess(Creep(name))

					break

				case ERR_NOT_ENOUGH_ENERGY:
					processes.add(Spawn.waitForEnergy(name))
					return

				default:
					log.warn(Returns[returnCode])
			}
		}

		yield
	}
}

export namespace Spawn {
	export function* waitForEnergy(name: string) {
		let spawn = Game.spawns[name]

		if (spawn) {
			const { energy } = spawn.store

			while (spawn = Game.spawns[name]) {
				if (energy != spawn.store.energy) {
					runProcess(Spawn(name))
					return
				}

				yield
			}
		}
	}
}
