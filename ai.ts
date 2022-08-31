namespace ai {
    export class AIInput implements inputs.Input {
        stick: inputs.StickState
        punch: boolean
        kick: boolean

        interval: timers.Timer
        attackInterval: timers.Timer

        constructor() {
            this.interval = new timers.Timer()
            this.attackInterval = new timers.Timer()

            this.stick = inputs.StickState.Neutral
            this.punch = false
            this.kick = false
        }

        update(faceRight: boolean): void {
            this.interval.update()
            this.attackInterval.update()

            if(this.attackInterval.elapsed > 500) {
                this.attackInterval.elapsed = 0
                this.punch = Math.percentChance(25)
                this.kick = Math.percentChance(25)
            }

            if(this.interval.elapsed > 1000) {
                this.interval.elapsed = 0
                this.stick = Math.percentChance(50)
                    ? inputs.StickState.Neutral
                    : Math.percentChance(60)
                        ? (Math.percentChance(75)
                            ? inputs.StickState.Forward
                            : inputs.StickState.Back)
                        : (Math.percentChance(50)
                            ? inputs.StickState.Up
                            : inputs.StickState.Down)
            }
        }
    }
}