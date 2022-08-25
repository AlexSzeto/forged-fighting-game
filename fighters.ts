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
        SpecialMove
    }

    const NEUTRAL_STATES: State[] = [State.Idle, State.Walk, State.Crouch]

    export type FighterData = {
        frameData: frames.FrameData
        specials: SpecialMoveData[]
    }

    export type SpecialMoveSharedData = {
        frameSetKey: string,
        ground: boolean,
        air: boolean
    }

    export type SpecialMoveData = SpecialMoveSharedData & {
        motionInput: string
    }

    export type SpecialMoveTracker = SpecialMoveSharedData & {
        motion: inputs.MotionInput
    }

    export class Fighter implements frames.FrameControlledSprite{
        sprite: Sprite
        faceRight: boolean
        ox: number = 0
        oy: number = 0

        frameData: frames.FrameData
        groundPlane: number = -1
        gravity: number = 0

        input: inputs.Input
        specials: SpecialMoveTracker[] = []

        state: State = State.Idle
        airborne: boolean

        constructor(data: FighterData, input: inputs.Input, spawnAs1P: boolean) {
            this.frameData = data.frameData
            this.input = input

            for(const specialMove of data.specials) {
                this.specials.push({
                    frameSetKey: specialMove.frameSetKey,
                    ground: specialMove.ground,
                    air: specialMove.air,
                    motion: new inputs.MotionInput(specialMove.motionInput),
                })
            }

            this.state = State.Idle
            this.faceRight = spawnAs1P

            this.sprite = sprites.create(assets.image`pixel`, SpriteKind.Player)
            this.sprite.setFlag(SpriteFlag.StayInScreen, true)
            this.sprite.scale = 1.3
            this.gravity = 400 * this.sprite.scale

            if (spawnAs1P) {
                this.sprite.x = 40
            } else {
                this.sprite.x = 100
            }

            this.frameData.setFrameSet('idle', this)
        }
        
        update(): void {
            if(this.groundPlane < 0) {
                this.groundPlane = this.sprite.y
            }

            this.input.update(this.faceRight)
            
            let nextState = this.state
            let nextSetKey = this.frameData.setKey

            if(this.frameData.done) {
                nextState = State.Idle
                nextSetKey = 'idle'
            }

            if (this.airborne && this.sprite.y >= this.groundPlane) {
                this.airborne = false
                this.sprite.vx = 0
                this.sprite.vy = 0
                this.sprite.ay = 0
                this.sprite.y = this.groundPlane
                nextState = State.Idle
                nextSetKey = 'idle'
            }

            if(this.sprite.y < this.groundPlane) {
                this.airborne = true
                this.sprite.ay = this.gravity
            }

            for(const specialMove of this.specials) {
                specialMove.motion.update(this.input)
                if(
                    specialMove.motion.execute
                    && (
                        (this.airborne && specialMove.air)
                        || (!this.airborne && specialMove.ground)
                    )
                ) {
                    nextState = State.SpecialMove
                    nextSetKey = specialMove.frameSetKey
                }
            }

            // parse input
            if (this.input.punch) {
                switch (nextState) {
                    case State.Idle:
                    case State.Walk:
                        nextState = State.Punch
                        nextSetKey = 'punch'
                        break
                    case State.Crouch:
                        nextState = State.CrouchPunch
                        nextSetKey = 'crouch-punch'
                        break
                    case State.Jump:
                        nextState = State.JumpPunch
                        nextSetKey = 'jump-punch'
                        break
                }
            }

            if (this.input.kick) {
                switch (nextState) {
                    case State.Idle:
                    case State.Walk:
                        nextState = State.Kick
                        nextSetKey = 'kick'
                        break
                    case State.Crouch:
                        nextState = State.CrouchPunch
                        nextSetKey = 'crouch-kick'
                        break
                    case State.Jump:
                        nextState = State.JumpPunch
                        nextSetKey = 'jump-kick'
                        break
                }
            }

            if (NEUTRAL_STATES.indexOf(nextState) >= 0) {
                switch (this.input.stick) {
                    case inputs.StickState.Down:
                    case inputs.StickState.DownForward:
                    case inputs.StickState.DownBack:
                        nextState = State.Crouch
                        nextSetKey = 'crouch'
                        break
                    case inputs.StickState.Forward:
                        nextState = State.Walk
                        nextSetKey = 'walk-forward'
                        break
                    case inputs.StickState.Back:
                        nextState = State.Walk
                        nextSetKey = 'walk-back'
                        break
                    case inputs.StickState.UpBack:
                        nextState = State.Jump
                        nextSetKey = 'jump-back'
                        break
                    case inputs.StickState.Up:
                        nextState = State.Jump
                        nextSetKey = 'jump-up'
                        break
                    case inputs.StickState.UpForward:
                        nextState = State.Jump
                        nextSetKey = 'jump-forward'
                        break
                    case inputs.StickState.Neutral:
                        nextState = State.Idle
                        nextSetKey = 'idle'
                        break
                }
            }

            // switch frame set
            if (this.frameData.setKey != nextSetKey) {
                this.state = nextState
                this.frameData.setFrameSet(nextSetKey, this)

            }

            this.frameData.update(this)
            const create = this.frameData.create
            if (create) {
                const projectile = new Projectile(create, this)
            }

        }
    }

    export const projectileList: Projectile[] = []
    export class Projectile implements frames.FrameControlledSprite {
        sprite: Sprite
        faceRight: boolean
        ox: number = 0
        oy: number = 0

        constructor(
            private frameData: frames.FrameData,
            private createdBy: Fighter
        ) {
            this.sprite = sprites.create(assets.image`pixel`, SpriteKind.Projectile)
            projectileList.push(this)
            this.sprite.setFlag(SpriteFlag.AutoDestroy, true)
            this.sprite.x = this.createdBy.sprite.x
            this.sprite.y = this.createdBy.sprite.y
            this.sprite.scale = 1.3
            this.faceRight = this.createdBy.faceRight

            this.frameData.setFrameSet('animation', this)
        }

        update(): void {
            this.frameData.update(this)
        }
    }

    sprites.onDestroyed(SpriteKind.Projectile, sprite => {
        projectileList.removeElement(projectileList.find(projectile => projectile.sprite == sprite))
    })
}