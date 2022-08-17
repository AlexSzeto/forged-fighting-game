namespace fighters {
    enum State {
        Idle,
        Walk,
        Punch,
        Kick,
        Crouch,
        CrouchPunch,
        CrouchKick,
        Jump,
        JumpPunch,
        JumpKick,
    }

    const NEUTRAL_STATES: State[] = [State.Idle, State.Walk]

    export type FighterData = {
        frameData: frames.FrameData
    }

    export class Fighter {
        sprite: Sprite
        frameData: frames.FrameData

        input: inputs.Input

        state: State
        faceRight: boolean

        constructor(data: FighterData, input: inputs.Input, spawnAs1P: boolean) {
            this.frameData = data.frameData
            this.input = input

            this.state = State.Idle
            this.faceRight = spawnAs1P

            this.sprite = sprites.create(assets.image`pixel`, SpriteKind.Player)
            this.sprite.setFlag(SpriteFlag.StayInScreen, true)
            this.sprite.ay = 400

            if (spawnAs1P) {
                this.sprite.x = 40
            } else {
                this.sprite.x = 100
            }

            this.frameData.update(this.sprite, this.faceRight)
        }

        update(): void {
            let nextState = this.state
            let nextSetKey = ''

            switch (nextState) {
                case State.Jump:
                    if (this.sprite.y >= 100) {
                        this.sprite.vx = 0
                        this.sprite.vy = 0
                        nextState = State.Idle
                    }
                    break
            }

            // parse input
            if (NEUTRAL_STATES.indexOf(nextState) >= 0) {                
                switch (this.input.stick) {
                    case inputs.StickState.Forward:
                        nextState = State.Walk
                        nextSetKey = 'walk-forward'
                        break
                    case inputs.StickState.Back:
                        nextState = State.Walk
                        nextSetKey = 'walk-back'
                        break
                    case inputs.StickState.Neutral:
                        nextState = State.Idle
                        nextSetKey = 'idle'
                        break
                }
            }

            // switch frame set
            if (this.state != nextState) {
                this.state = nextState
                this.frameData.frameSetKey = nextSetKey
            }

            this.frameData.update(this.sprite, this.faceRight)
        }
    }
}