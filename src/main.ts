import { wrapFunction, MapD } from "./lib"

const { values } = Object

console.log("started")

export const loop = wrapFunction(() => {
	for (const name in Memory.creeps)
		if (!(name in Game.creeps))
			delete Memory.creeps[name]

	const creepsByOrigin = new MapD<string, Creep[]>(Array)
	const spawnsByRoom = new MapD<Room, StructureSpawn[]>(Array)

	for (const creep of values(Game.creeps)) {
		if (!creep.memory.origin)
			creep.memory.origin = creep.room.name

		creepsByOrigin.getD(creep.memory.origin).push(creep)

	}

	for (const spawn of values(Game.spawns))
		spawnsByRoom.getD(spawn.room).push(spawn)

	for (const room of values(Game.rooms)) {
		const creeps = creepsByOrigin.getD(room.name)
		const spawns = spawnsByRoom.getD(room)

		if (creeps.length < 5)
			for (const spawn of spawns)
				spawn.spawnCreep([ WORK, MOVE, MOVE, CARRY ], Game.time.toString(36))

		for (const creep of creeps) {
			if (!creep.store.getFreeCapacity())
				creep.memory.task = Task.Deposit
			else if (!creep.store.getUsedCapacity())
				creep.memory.task = Task.Collect

			switch (creep.memory.task) {
				case Task.Collect:
					const source = creep.pos.findClosestByRange(FIND_SOURCES)

					if (source)
						if (creep.harvest(source) == ERR_NOT_IN_RANGE)
							creep.moveTo(source, { visualizePathStyle: { stroke: "blue" } })

					break

				case Task.Deposit:
					let target: Structure | undefined = room.controller

					for (const spawn of spawns) {
						if (spawn.store.getFreeCapacity(RESOURCE_ENERGY)) {
							target = spawn
							break
						}
					}

					if (target)
						if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
							creep.moveTo(target, { visualizePathStyle: { stroke: "green" } })

					break
			}
		}
	}
})
