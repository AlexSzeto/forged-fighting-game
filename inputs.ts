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
    }

    export interface Input {
        stick: StickState
        punch: boolean
        kick: boolean
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

    
}
