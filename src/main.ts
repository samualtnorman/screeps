import { tick } from "./kernel"
import { log, wrap } from "./utils"

log(HERE)

export const loop = wrap(tick)
