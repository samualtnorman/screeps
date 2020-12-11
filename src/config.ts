export const rooms = {
	default: {
		roleCounts: {
			worker: 3,
			harvester: 2
		}
	},
	E45S22: {
		roleCounts: {
			worker: 3,
			harvester: 2,
			fueler: 2
		}
	}
}

export const roleBodies: Record<string, BodyPartConstant[]> = {
	worker: [ WORK, CARRY, MOVE ],
	harvester: [ MOVE, WORK, WORK ],
	fueler: [ CARRY, CARRY, MOVE ]
}
