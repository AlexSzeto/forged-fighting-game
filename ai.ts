namespace ai {
    export class AIInput implements inputs.Input {
        stick: inputs.StickState
        punch: boolean
        kick: boolean

        interval: timers.Timer

        constructor() {
            this.interval = new timers.Timer()
            this.stick = inputs.StickState.Neutral
            this.punch = false
            this.kick = false
        }

        update(faceRight: boolean): void {
            this.interval.update()
            if(this.interval.elapsed > 1000) {
                this.interval.elapsed = 0
                this.stick = Math.percentChance(50)
                    ? inputs.StickState.Neutral
                    : Math.percentChance(50)
                        ? inputs.StickState.Forward
                        : inputs.StickState.Back
            }
        }
    }
}