// import { wrapFunction, MapD } from "./lib"
import { wrapFunction } from "./lib"
import { init as initCreep } from "./processes/creep"

console.log("started")

const processes: Generator[] = []

for (const name in Game.creeps)
	processes.push(initCreep(name))

export const loop = wrapFunction(() => {
	for (const name in Memory.creeps)
		if (!(name in Game.creeps))
			delete Memory.creeps[name]

	const finishedProcesses: number[] = []

	for (let i = 0; i < processes.length; i++)
		if (processes[i].next().done)
			finishedProcesses.push(i)

	for (const processIndex of finishedProcesses.reverse())
		processes.splice(processIndex, 1)

	for (const room of Object.values(Game.rooms)) {
		if (room.find(FIND_MY_CREEPS).length < 5) {
			for (const spawn of room.find(FIND_MY_SPAWNS)) {
				const name = Game.time.toString(36)

				if (spawn.spawnCreep([ WORK, MOVE, MOVE, CARRY ], name) == OK)
					processes.push(initCreep(name))
			}
		}
	}

	// const creepsByOrigin = new MapD<string, Creep[]>(Array)
	// const spawnsByRoom = new MapD<Room, StructureSpawn[]>(Array)

	// for (const creep of values(Game.creeps)) {
	// 	if (!creep.memory.origin)
	// 		creep.memory.origin = creep.room.name

	// 	creepsByOrigin.getD(creep.memory.origin).push(creep)
	// }

	// for (const spawn of values(Game.spawns))
	// 	spawnsByRoom.getD(spawn.room).push(spawn)

	// for (const room of values(Game.rooms)) {
	// 	const creeps = creepsByOrigin.getD(room.name)
	// 	const spawns = spawnsByRoom.getD(room)

	// 	if (creeps.length < 5)
	// 		for (const spawn of spawns)
	// 			spawn.spawnCreep([ WORK, MOVE, MOVE, CARRY ], Game.time.toString(36))

	// 	for (const creep of creeps) {
	// 		if (!creep.store.getFreeCapacity())
	// 			creep.memory.task = Task.Deposit
	// 		else if (!creep.store.getUsedCapacity())
	// 			creep.memory.task = Task.Collect

	// 		switch (creep.memory.task) {
	// 			case Task.Collect:
	// 				const source = creep.pos.findClosestByRange(FIND_SOURCES)

	// 				if (source)
	// 					if (creep.harvest(source) == ERR_NOT_IN_RANGE)
	// 						creep.moveTo(source)

	// 				break

	// 			case Task.Deposit:
	// 				let target: Structure | undefined = room.controller

	// 				for (const spawn of spawns) {
	// 					if (spawn.store.getFreeCapacity(RESOURCE_ENERGY)) {
	// 						target = spawn
	// 						break
	// 					}
	// 				}

	// 				if (target)
	// 					if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
	// 						creep.moveTo(target)

	// 				break
	// 		}
	// 	}
	// }
})
