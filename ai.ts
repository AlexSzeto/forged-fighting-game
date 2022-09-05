namespace ai {
    export class AIInput implements inputs.Input {
        stick: inputs.StickState
        punch: boolean
        kick: boolean

        interval: timers.Timer
        attackInterval: timers.Timer
        currentSpecial: inputs.MotionInput
        currentSpecialStep: number

        fighter: fighters.Fighter
        opponent: fighters.Fighter

        constructor() {
            this.interval = new timers.Timer()
            this.attackInterval = new timers.Timer()
            this.currentSpecial = null

            this.stick = inputs.StickState.Neutral
            this.punch = false
            this.kick = false
        }

        update(faceRight: boolean): void {
            this.interval.update()
            this.attackInterval.update()

            if(this.currentSpecial) {
                if (this.attackInterval.elapsed > 50) {
                    this.attackInterval.elapsed = 0
                    this.stick = this.currentSpecial.nextMotion
                    this.punch = this.currentSpecial.executePunch
                    this.kick = this.currentSpecial.executeKick
                    if(this.punch || this.kick) {
                        this.currentSpecial = null
                    }
                }
            } else {

                if (this.attackInterval.elapsed > 500) {
                    this.attackInterval.elapsed = 0
                    if(Math.percentChance(15)) {
                        this.currentSpecial = Math.pickRandom(this.fighter.specials).motion
                    } else {
                        this.punch = Math.percentChance(25)
                        this.kick = Math.percentChance(25)
                    }
                } else {
                    this.punch = false
                    this.kick = false
                }

                if (this.interval.elapsed > 250 && this.opponent.attacking) {
                    this.interval.elapsed = 0
                    if(Math.percentChance(50)) {
                        this.stick = inputs.StickState.Back
                    }                    
                } else if (this.interval.elapsed > 500) {
                    this.interval.elapsed = 0
                    this.stick = Math.percentChance(30)
                        ? inputs.StickState.Neutral
                        : Math.percentChance(70)
                            ? (Math.percentChance(80)
                                ? (Math.percentChance(60)
                                    ? inputs.StickState.Forward
                                    : inputs.StickState.UpForward
                                )
                                : (Math.percentChance(60)
                                    ? inputs.StickState.Back
                                    : inputs.StickState.UpBack
                                )
                            )
                            : (Math.percentChance(30)
                                ? inputs.StickState.Up
                                : inputs.StickState.Down)
                }
            }
        }
    }

    export class DummyInput implements inputs.Input {
        stick: inputs.StickState
        punch: boolean
        kick: boolean

        fighter: fighters.Fighter
        opponent: fighters.Fighter

        constructor() {
            this.stick = inputs.StickState.Neutral
            this.punch = false
            this.kick = false
        }

        update(faceRight: boolean): void {
        }
    }
}