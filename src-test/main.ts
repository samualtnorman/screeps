namespace Programs {
	export function example(memory: { i: number }) {
		memory.i++
		return 0
	}

	export function print(memory: { msg: string }) {
		console.log(memory.msg)
		return 0
	}
}
​
const processes: {
	name: string
	memory: any
}[] = []

function startProcess<N extends keyof typeof Programs>(name: N, memory: Parameters<typeof Programs[N]>[0]) {
	processes.push({ name, memory })
}
​
startProcess("example", { i: 1 })
