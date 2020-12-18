import { addProcess, runProcess, stop } from "../kernel"
import { logReturnCode, ticks, warn } from "../utils"

export function* Creep(name: string) {
	const creep = Game.creeps[name]

	if (creep.store.getUsedCapacity() > creep.store.getCapacity() / 2)
		runProcess(Creep.deposit(creep))
	else
		runProcess(Creep.deposit(creep))
}

export namespace Creep {
	export function* startHarvest(name: string) {
		for (const creep of ticks(Game.creeps[name])) {
			const source = creep.pos.findClosestByPath(FIND_SOURCES)

			if (source) {
				const returnCode = creep.harvest(source)

				switch (returnCode) {
					case OK:
						runProcess(harvest(name, source.id))
						return

					case ERR_NOT_IN_RANGE: {
						const returnCode = creep.moveTo(source)

						switch (returnCode) {
							case OK:
								break

							default:
								logReturnCode(returnCode)
						}
					} break

					default:
						logReturnCode(returnCode)
				}
			} else
				warn("no source")

			yield
		}
	}

	export function* harvest(name: string, id: Id<Source>) {
		const source = Game.getObjectById(id)!
		let creep

		while (creep = Game.creeps[name]) {
			const returnCode = creep.harvest(source)

			switch (returnCode) {
				case OK:
					if (!creep.store.getFreeCapacity()) {
						addProcess(deposit(creep))
						return
					}

					break
				default:
					logReturnCode(returnCode)
			}

			yield
		}
	}

	export function* deposit(creep_: Creep) {
		for (const creep of ticks(creep_)) {
			const { name } = creep

			let target: Structure | undefined = creep.room.controller

			for (const spawn of creep.room.find(FIND_MY_SPAWNS)) {
				if (spawn.store.getFreeCapacity(RESOURCE_ENERGY)) {
					target = spawn
					break
				}
			}

			if (!target) {
				warn(`${name}: no target`)
				return
			}

			const creep_ = creep

			for (const creep of ticks(creep_)) {
				const returnCode = creep.transfer(target, RESOURCE_ENERGY)

				switch (returnCode) {
					case ERR_NOT_IN_RANGE: {
						yield* waitFatigue(creep)

						const returnCode = creep.moveTo(target)

						switch (returnCode) {
							case OK:
								break

							default:
								logReturnCode(returnCode)
						}
					} break

					case OK:
						if (!creep.store.getUsedCapacity()) {
							runProcess(startHarvest(name))
							return
						}
						break

					case ERR_NOT_ENOUGH_ENERGY:
						runProcess(startHarvest(name))
						return

					case ERR_FULL:
						runProcess(Creep(name))
						return

					default:
						logReturnCode(returnCode)
				}

				yield
			}

			break
		}
	}

	export function*  waitFatigue(creep_: Creep) {
		for (const creep of ticks(creep_)) {
			if (!creep.fatigue)
				return

			yield
		}

		stop()
		yield
	}
}
