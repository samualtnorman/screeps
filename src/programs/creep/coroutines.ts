import { YieldCode } from "../../kernel"
import { ticks } from "../../utils"

export function* waitFatigue(creep: Creep) {
	for (creep of ticks(creep)) {
		if (!creep.fatigue)
			return

		yield
	}

	yield YieldCode.Stop
}
