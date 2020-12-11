import { buildCreep } from "./lib"
import { wrapFunction } from "./utils/error-mapper"

class MapD<K, V> extends Map<K, V> {
	constructor(public fallbackHandler: () => V) { super() }

	getD(key: K) {
		let value = this.get(key)

		if (value)
			return value

		value = this.fallbackHandler()

		this.set(key, value)

		return value
	}
}

const { values } = Object
const spawns = new MapD<string, StructureSpawn[]>(Array)
const creeps = new MapD<string, Creep[]>(Array)

wrapFunction(() => {
	console.log("started")

	for (const spawn of values(Game.spawns))
		spawns.getD(spawn.room.name).push(spawn)

	for (const creep of values(Game.creeps))
		creeps.getD(creep.room.name).push(creep)
})()

export const loop = wrapFunction(() => {
	for (const name in Memory.creeps)
		if (!(name in Game.creeps))
			delete Memory.creeps[name]

	for (const room of values(Game.rooms)) {
		const roomSpawns = spawns.getD(room.name)
		const roomCreeps = creeps.getD(room.name)

		if (roomCreeps.length < 5)
			for (const spawn of roomSpawns)
				spawn.spawnCreep([ WORK, MOVE, MOVE, CARRY ], Game.time.toString(36), { memory: { origin: room.name } })

		for (const creep of roomCreeps) {
			if (creep.store.getFreeCapacity()) {
				const source = creep.pos.findClosestByRange(FIND_SOURCES)

				if (source) {
					creep.moveTo(source, { visualizePathStyle: { stroke: "blue" } })
					creep.harvest(source)
					creep.say("harvest")
				}
			} else {
				let target: Structure | undefined = room.controller

				for (const spawn of roomSpawns) {
					if (spawn.store.getFreeCapacity())
						target = spawn
						break
					}

				if (target) {
					creep.moveTo(target, { visualizePathStyle: { stroke: "green" } })
					creep.transfer(target, RESOURCE_ENERGY)
					creep.say("transfer")
				}
			}
		}
	}
})

loop()
