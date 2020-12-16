import { addProcess, runProcess } from ".."
import { returns, warn } from "../../utils"

export function* Creep(name: string) {
	const creep = Game.creeps[name]

	if (creep.store.getUsedCapacity() > creep.store.getCapacity() / 2)
		runProcess(Creep.deposit(name))
	else
		runProcess(Creep.deposit(name))
}

export namespace Creep {
	export function* startHarvest(name: string) {
		let creep

		while (creep = Game.creeps[name]) {
			const source = creep.pos.findClosestByPath(FIND_SOURCES)

			if (source) {
				const returnCode = creep.harvest(source)

				switch (returnCode) {
					case OK:
						runProcess(harvest(name, source.id))
						return

					case ERR_NOT_IN_RANGE:
						creep.moveTo(source)
						break

					default:
						warn(returns[returnCode])
				}
			}

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
						addProcess(deposit(name))
						return
					}

					break
				default:
					warn(returns[returnCode])
			}

			yield
		}
	}

	export function* deposit(name: string) {
		let creep = Game.creeps[name] as Creep | undefined

		if (creep) {
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

			while (creep = Game.creeps[name]) {
				const returnCode = creep.transfer(target, RESOURCE_ENERGY)

				switch (returnCode) {
					case ERR_NOT_IN_RANGE:
						creep.moveTo(target)
						break

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
						warn(returns[returnCode])
				}

				yield
			}
		}
	}
}
