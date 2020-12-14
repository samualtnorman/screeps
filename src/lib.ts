import { SourceMapConsumer } from "source-map"

// export function buildCreep(role: string, room: Room, creeps: Creep[]) {
// 	const memory: CreepMemory = { origin: room.name }
// 	let body: BodyPartConstant[] = []

// 	switch (role) {
// 		case "harvester":
// 			for (var source of room.find(FIND_SOURCES)) {
// 				var container = source.pos.findInRange(FIND_STRUCTURES, 1, {
// 					filter : { structureType: STRUCTURE_CONTAINER }
// 				})[0];

// 				if (
// 					container &&
// 					creeps.every(creep => creep.memory.target != container.id)
// 				) {
// 					var costs = [ 250, 400, 500, 650, 750 ];

// 					body = [ WORK, MOVE ];

// 					for (
// 						var i = 0;
// 						i < 5 && costs[i] < room.energyAvailable;
// 						i++
// 					) {
// 						body.push(WORK);
// 						i % 2 && body.push(MOVE);
// 					}

// 					memory.target = container.id;

// 					break;
// 				}
// 			}

// 			break;
// 		default:
// 			body = [ ...roleBodies[role] ];

// 			var cost = body.reduce(
// 					(cost, part) => cost + BODYPART_COST[part],
// 					0
// 				),
// 				level = Math.floor((room.energyAvailable - cost) / cost);

// 			for (var i = 0; i < level; i++)
// 				body.push(...roleBodies[role]);
// 	}

// 	return [ body.sort(), `${role}_${Game.time.toString(36)}`, { memory } ];
// }

export class MapD<K, V> extends Map<K, V> {
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

let consumer: SourceMapConsumer | undefined

export function getConsumer() {
	return consumer = consumer || new SourceMapConsumer(require("main.js.map"))
}

export const cache = new Map<string, string>()

export function sourceMappedStackTrace(error: Error | string): string {
	const stack: string = error instanceof Error
		? error.stack as string
		: error

	const gotCache = cache.get(stack)

	if (gotCache != undefined)
		return gotCache

	const re = /^\s+at\s+(.+?\s+)?\(?([0-z._\-\\\/]+):(\d+):(\d+)\)?$/gm

	let match: RegExpExecArray | null
	let outStack = error.toString()

	while (match = re.exec(stack)) {
		if (match[2] === "main") {
			const pos = getConsumer().originalPositionFor({
				column: parseInt(match[4], 10),
				line: parseInt(match[3], 10)
			})

			if (pos.line != null) {
				if (pos.name) {
					outStack += `\n    at ${pos.name} (${pos.source}:${pos.line}:${pos.column})`
				} else {
					if (match[1]) {
						// no original source file name known - use file name from given trace
						outStack += `\n    at ${match[1]} (${pos.source}:${pos.line}:${pos.column})`
					} else {
						// no original source file name known or in given trace - omit name
						outStack += `\n    at ${pos.source}:${pos.line}:${pos.column}`
					}
				}
			} else {
				// no known position
				break
			}
		} else {
			// no more parseable lines
			break
		}
	}

	cache.set(stack, outStack)

	return outStack
}

export function wrapFunction(loop: () => void): () => void {
	return () => {
		try {
			loop()
		} catch (error) {
			if (error instanceof Error) {
				let message

				if ("sim" in Game.rooms)
					message = `Source maps don't work in the simulator - displaying original error<br>${_.escape(error.stack)}`
				else
					message = _.escape(sourceMappedStackTrace(error))

				throw { message }
			} else
				throw error
		}
	}
}
