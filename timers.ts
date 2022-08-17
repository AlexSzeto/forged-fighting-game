namespace timers {
    export class Timer {
        private timer: number
        elapsed: number

        constructor() {
            this.timer = game.runtime()
        }

        update(): void {
            const currentTime = game.runtime()
            this.elapsed += currentTime - this.timer
            this.timer = currentTime
        }
    }

    export function scale(elapsed: number, valuePerSecond: number): number {
        return Math.round(elapsed / 1000 * valuePerSecond)
    }
}