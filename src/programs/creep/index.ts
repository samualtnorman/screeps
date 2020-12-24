import { addProcess, Process, runProcess, YieldCode } from "../../kernel"
import { logReturnCode, ticks, update, warn } from "../../utils"
import { waitFatigue } from "./coroutines"

export function* start(creep_: Creep): Process {
	const creep = update(creep_)

	if (!creep)
		return

	if (creep.store.getUsedCapacity() > creep.store.getCapacity() / 2)
		runProcess(startDeposit(creep))
	else
		runProcess(startHarvest(creep))
}

export function* startHarvest(creep: Creep) {
	for (creep of ticks(creep)) {
		let source = creep.pos.findClosestByPath(FIND_SOURCES)
		yield YieldCode.Again

		if (source) {
			const returnCode = creep.harvest(source)
			yield YieldCode.Again

			switch (returnCode) {
				case OK: {
					addProcess(harvestSource(creep, source))
				} break
			}
		} else
			warn(`${creep.name}: no source`)
	}
}

export function* harvestSource(creep: Creep, source: Source): Process {

}

export function* startDeposit(creep: Creep): Process {

}

export function* deposit(creep: Creep, target: Structure): Process {

}
