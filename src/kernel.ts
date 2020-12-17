export const processes = new Set<Generator>();
export const processQueue: Generator[] = [];

export function runProcess(process: Generator) {
	processes.add(process);

	if (!processQueue.includes(process))
		processQueue.push(process);
}

export function addProcess(process: Generator) {
	processes.add(process);
}
