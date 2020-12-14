// import { MapD } from "./lib"

// let roomSpawnsCache = new MapD<Room, StructureSpawn[]>(Array)
// let roomSpawnsCacheTime: number

// export function getRoomSpawns(room: Room) {
// 	if (Game.time == roomSpawnsCacheTime)
// 		return roomSpawnsCache.getD(room)

// 	roomSpawnsCache.clear()

// 	for (const spawn of Object.values(Game.spawns))
// 		roomSpawnsCache.getD(spawn.room).push(spawn)

// 	return roomSpawnsCache
// }
