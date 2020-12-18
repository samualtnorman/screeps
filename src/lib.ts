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

export class DynamicMap<K, V> extends Map<K, V> {
	constructor(private fallbackHandler: (key: K) => V) { super() }

	get(key: K) {
		let value = super.get(key)

		if (value)
			return value

		value = this.fallbackHandler(key)

		this.set(key, value)

		return value
	}
}

export class DynamicWeakMap<K extends object, V> extends WeakMap<K, V> {
	constructor(private fallbackHandler: (key: K) => V) { super() }

	get(key: K) {
		let value = super.get(key)

		if (value)
			return value

		value = this.fallbackHandler(key)

		this.set(key, value)

		return value
	}
}

export type TypeGuard<A, B extends A> = (x: A) => x is B

export class CustomError extends Error {
	name = this.constructor.name;

	constructor(message: string) {
		super(message);
	}
}

export class AssertError extends CustomError {
	constructor(message: string) {
		super(message);
	}
}

export function assert(value: any): asserts value

export function assert<
	A,
	B extends A
>(
	value: A,
	g1: TypeGuard<A, B>
): asserts value is B

export function assert<
	A,
	B extends A,
	C extends B
>(
	value: A,
	g1: TypeGuard<A, B>,
	g2: TypeGuard<B, C>
): asserts value is C

export function assert<
	A,
	B extends A,
	C extends B,
	D extends C
>(
	value: A,
	g1: TypeGuard<A, B>,
	g2: TypeGuard<B, C>,
	g3: TypeGuard<C, D>
): asserts value is D

export function assert(value: any, ...guards: Array<TypeGuard<any, any>>) {
	if (guards.length) {
		for (const guard of guards)
			if (!guard(value))
				throw new AssertError(`${guard.name || "assertion"} failed: got ${getType(value)}`)
	} else if (!value)
		throw new AssertError(`assertion failed: got ${getType(value)}`)
}

export function getType(value: any) {
	const typeofValue = typeof value

	if (typeofValue == "object") {
		if (!value)
			return "null"

		if (typeof value.constructor == "function" && value.constructor.name)
			return value.constructor.name
	}

	return typeofValue
}

export function swatch() {
	const callbacks = new Map<any, () => any>()
	let fallback: (() => any) | undefined

	return {
		case(value: any, callback: () => any) {
			callbacks.set(value, callback)
			return this
		},
		default(callback: () => any) {
			fallback = callback
			return this
		},
		go(value: any) {
			return (callbacks.get(value) || fallback)?.()
		}
	}
}

export function cssFunction(name: string, ...args: (boolean | number | string)[]) {
	return `${name}(${args.join(", ")})`
}

export function lerp(start: number, amount: number, end: number) {
	return (1 - amount) * start + amount * end
}

export function* matches(regex: RegExp, string: string) {
	let match = regex.exec(string)

	if (match) {
		yield match

		if (regex.global)
			while (match = regex.exec(string))
				yield match
	}
}
