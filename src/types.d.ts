declare const enum Task {
	Collect,
	Deposit
}

interface CreepMemory {
	origin?: string
	target?: string
	task?: Task
}
