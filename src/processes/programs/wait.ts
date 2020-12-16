export function* wait(ticks: number) {
	const end = Game.time + Math.max(ticks, 1);

	while (Game.time < end)
		yield;
}
