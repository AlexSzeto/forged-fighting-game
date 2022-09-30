namespace timers {

    export class Timer {
        
        private timer: number
        private pauseRemainder: number
        elapsed: number

        constructor() {            
            this.timer = game.runtime()
            this.elapsed = 0
            this.pauseRemainder = 0            
        }

        update(): boolean {
            const wasPaused = this.pauseRemainder > 0
            const currentTime = game.runtime()
            if(this.pauseRemainder > 0) {
                this.pauseRemainder -= currentTime - this.timer
                if (this.pauseRemainder <= 0) {
                    this.elapsed += -this.pauseRemainder
                }
            } else {
                this.elapsed += currentTime - this.timer
            }
            this.timer = currentTime
            return wasPaused && this.pauseRemainder <= 0
        }

        pause(duration: number): void {
            this.pauseRemainder = duration
        }

        get paused(): boolean {
            return this.pauseRemainder > 0
        }
    }

    export function scale(elapsed: number, valuePerSecond: number): number {
        return Math.round(elapsed / 1000 * valuePerSecond)
    }
}