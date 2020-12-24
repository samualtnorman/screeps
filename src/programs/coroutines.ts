export function* wait(ticks: number) {
	const end = Game.time + ticks

	while (Game.time < end)
		yield
}
