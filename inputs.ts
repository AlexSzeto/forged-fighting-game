namespace inputs {
    export enum StickState {
        Neutral,
        Forward,
        Back,
        Down,
        DownForward,
        DownBack,
        Up,
        UpForward,
        UpBack,

        ChargeDown,
        ChargeBack,
    }

    export interface Input {
        stick: StickState
        punch: boolean
        kick: boolean

        update(faceRight: boolean): void
    }

    export class ControllerInput implements Input {
        stick: StickState
        punch: boolean
        kick: boolean
        
        private pressedA: boolean
        private pressedB: boolean

        constructor() {
            this.stick = StickState.Neutral
            this.punch = false
            this.kick = false

            this.pressedA = false
            this.pressedB = false            
        }

        update(faceRight: boolean) {
            const forward = faceRight ? controller.right.isPressed() : controller.left.isPressed()
            const backward = faceRight ? controller.left.isPressed() : controller.right.isPressed()

            if (controller.up.isPressed()) {
                this.stick =
                    forward ? StickState.UpForward :
                    backward ? StickState.UpBack :
                    StickState.Up

            } else if (controller.down.isPressed()) {
                this.stick =
                    forward ? StickState.DownForward :
                    backward ? StickState.DownBack :
                    StickState.Down
            } else {
                this.stick =
                    forward ? StickState.Forward :
                    backward ? StickState.Back :
                    StickState.Neutral
            }

            if (!this.pressedA && controller.A.isPressed()) {
                this.punch = true
                this.pressedA = true
            } else {
                this.punch = false
                if(!controller.A.isPressed()) {
                    this.pressedA = false
                }
            }

            if (!this.pressedB && controller.B.isPressed()) {
                this.kick = true
                this.pressedB = true
            } else {
                this.kick = false
                if (!controller.B.isPressed()) {
                    this.pressedB = false
                }
            }
        }
    }

    const DOWN_CHARGE_STICK_STATES:StickState[] = [
        StickState.Down,
        StickState.DownForward,
        StickState.DownBack
    ]

    const BACK_CHARGE_STICK_STATES:StickState[] = [
        StickState.Back,
        StickState.UpBack,
        StickState.DownBack
    ]

    const CHARGE_DURATION_REQUIREMENT = 1000
    const BUFFER_DURATION = 200

    export class MotionInput {
        private motionDebounce: timers.Timer
        private downChargeDebounce: timers.Timer
        private backChargeDebounce: timers.Timer

        private stickMotions: StickState[] = []
        private motionIndex: number = 0
        private _punch: boolean = false
        private _kick: boolean = false

        private _execute: boolean = false

        constructor(private directions: string) {
            const inputSet = directions.split(',')

            this.motionDebounce = new timers.Timer()
            this.downChargeDebounce = new timers.Timer()
            this.backChargeDebounce = new timers.Timer()

            for(const comboInput of inputSet) {
                switch(comboInput.toUpperCase()) {
                    case 'CB':
                        this.stickMotions.push(StickState.ChargeBack)
                        break
                    case 'B':
                        this.stickMotions.push(StickState.Back)
                        break
                    case 'CD':
                        this.stickMotions.push(StickState.ChargeDown)
                        break
                    case 'D':
                        this.stickMotions.push(StickState.Down)
                        break
                    case 'DB':
                        this.stickMotions.push(StickState.DownBack)
                        break
                    case 'DF':
                        this.stickMotions.push(StickState.DownForward)
                        break
                    case 'F':
                        this.stickMotions.push(StickState.Forward)
                        break
                    case 'UF':
                        this.stickMotions.push(StickState.UpForward)
                        break
                    case 'U':
                        this.stickMotions.push(StickState.Up)
                        break
                    case 'UB':
                        this.stickMotions.push(StickState.UpBack)
                        break
                    case 'P':
                        this._punch = true
                        break
                    case 'K':
                        this._kick = true
                        break
                }
            }
        }

        get execute(): boolean {
            return this._execute
        }

        get nextMotion(): StickState {
            if(this.motionIndex < this.stickMotions.length) {
                switch(this.stickMotions[this.motionIndex]) {
                    case StickState.ChargeDown:
                    case StickState.ChargeBack:
                        return StickState.DownBack
                    default:
                        return this.stickMotions[this.motionIndex]
                }
            } else {
                return this.motionIndex == 0 ? StickState.Neutral : this.stickMotions[this.motionIndex - 1]
            }
        }

        get executePunch(): boolean {
            return this.motionIndex >= this.stickMotions.length ? this._punch : false
        }

        get executeKick(): boolean {
            return this.motionIndex >= this.stickMotions.length ? this._kick : false
        }



        private matchMotion(nextMotion: StickState, stickMotion: StickState, downCharged: boolean, backCharged: boolean): boolean {
            return (
                nextMotion == stickMotion
                || (nextMotion == StickState.ChargeDown && downCharged)
                || (nextMotion == StickState.ChargeBack && backCharged)
            )
        }

        update(input:Input) {
            if(this.motionIndex == 0) {
                if (BACK_CHARGE_STICK_STATES.indexOf(input.stick) < 0) {
                    this.backChargeDebounce.elapsed = 0
                } else {
                    this.backChargeDebounce.update()
                }
                if (DOWN_CHARGE_STICK_STATES.indexOf(input.stick) < 0) {
                    this.downChargeDebounce.elapsed = 0
                } else {
                    this.downChargeDebounce.update()
                }
            }
            const backCharged = this.backChargeDebounce.elapsed >= CHARGE_DURATION_REQUIREMENT
            const downCharged = this.downChargeDebounce.elapsed >= CHARGE_DURATION_REQUIREMENT

            this.motionDebounce.update()

            if(this.stickMotions.length > 0) {
                const matchNextMotion = this.motionIndex < this.stickMotions.length && this.matchMotion(this.stickMotions[this.motionIndex], input.stick, downCharged, backCharged)
                const matchPrevMotion = this.motionIndex > 0 && this.matchMotion(this.stickMotions[this.motionIndex - 1], input.stick, downCharged, backCharged)

                if (matchNextMotion) {
                    this.motionIndex++
                    this.motionDebounce.elapsed = 0
                } else if (matchPrevMotion) {
                    if(this.motionIndex > 1 && this.motionDebounce.elapsed >= BUFFER_DURATION) {
                        this.motionIndex = 0
                    }
                } else {
                    this.motionIndex = 0
                }
            }

            this._execute = (
                this.motionIndex >= this.stickMotions.length
                && (!this._punch || input.punch)
                && (!this._kick || input.kick)
            )
        }
    }
}
