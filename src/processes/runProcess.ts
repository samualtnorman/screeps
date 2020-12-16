import { processes } from "./processes";
import { processQueue } from "./processQueue";

export function runProcess(process: Generator) {
	processes.add(process);

	if (!processQueue.includes(process))
		processQueue.push(process);
}

export function addProcess(process: Generator) {
	processes.add(process);
}
