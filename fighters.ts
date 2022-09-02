namespace fighters {


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
        opponent: Fighter
        
        // view
        sprite: Sprite
        faceRight: boolean

        // model
        frameData: frames.FrameData
        input: inputs.Input
        specials: SpecialMoveTracker[] = []

        // temporary
        gravity: number = 0
        groundPlane: number = -1

        // data cache
        ox: number = 0
        oy: number = 0
        box: collisions.Rectangle = new collisions.Rectangle()

        constructor(data: FighterData, input: inputs.Input, spawnAs1P: boolean) {
            this.frameData = data.frameData.clone()
            this.input = input

            for(const specialMove of data.specials) {
                this.specials.push({
                    frameSetKey: specialMove.frameSetKey,
                    ground: specialMove.ground,
                    air: specialMove.air,
                    motion: new inputs.MotionInput(specialMove.motionInput),
                })
            }

            this.faceRight = spawnAs1P

            this.sprite = sprites.create(assets.image`pixel`, SpriteKind.Player)
            this.sprite.setFlag(SpriteFlag.StayInScreen, true)
            this.sprite.scale = 1
            this.gravity = 600 * this.sprite.scale

            if (spawnAs1P) {
                this.sprite.x = 40
            } else {
                this.sprite.x = 100
            }

            this.frameData.setFrameSet('idle', this)
        }
        
        get airborne(): boolean { return this.frameData.frame.stance == frames.Stance.Airborne }
        get action(): frames.Action { return this.frameData.frame.action }
        get attacking(): boolean { return this.action == frames.Action.Attack }
        get stance(): frames.Stance { return this.frameData.frame.stance }
        get neutral(): boolean { return this.frameData.frame.action == frames.Action.Neutral }
        get groundedNeutral(): boolean { return this.neutral && !this.airborne }

        processInput(): void {
            if(this.groundPlane < 0) {
                this.groundPlane = this.sprite.y
            }

            this.input.update(this.faceRight)

            const prevKey = this.frameData.setKey

            // FRAME SET RESET
            if(this.frameData.done) {
                this.frameData.setFrameSet('idle')
            }

            // START TEMP MANAGEMENT
            if (this.airborne && this.sprite.vy > 0 && this.sprite.y > this.groundPlane + this.oy) {
                if(this.frameData.setKey == 'jump-wound') {
                    this.frameData.setFrameSet('prone')
                } else {
                    this.sprite.ay = 0
                    this.frameData.setFrameSet('idle')

                    if (
                        (this.sprite.x > this.opponent.sprite.x && this.faceRight)
                        || (this.sprite.x < this.opponent.sprite.x && !this.faceRight)
                    ) {
                        this.faceRight = !this.faceRight
                        this.frameData.setFrame(this)
                        this.opponent.faceRight = !this.opponent.faceRight
                        this.opponent.frameData.setFrame(this)
                    }
                }
            }

            if (this.sprite.y > this.groundPlane + this.oy) {
                this.sprite.y = this.groundPlane + this.oy
            }

            if(this.sprite.y < this.groundPlane + this.oy) {
                this.sprite.ay = this.gravity
            }

            if(
                (this.action == frames.Action.Pain || this.action == frames.Action.Block)
                && !this.airborne
            ) {
                this.sprite.fx = 40
            } else {
                this.sprite.fx = 0
            }

            // END TEMP MANAGEMENT

            for(const specialMove of this.specials) {
                specialMove.motion.update(this.input)
                if(
                    specialMove.motion.execute
                    && this.neutral
                    && (
                        (this.airborne && specialMove.air)
                        || (!this.airborne && specialMove.ground)
                    )
                ) {
                    this.frameData.setFrameSet(specialMove.frameSetKey)
                }
            }

            // parse input
            const processNormals = (hasInput: boolean, frameSetId: string) => {
                if(hasInput) {
                    if(this.neutral) {
                        switch (this.stance) {
                            case frames.Stance.Stand:
                                this.frameData.setFrameSet(frameSetId)
                                break
                            case frames.Stance.Crouched:
                                this.frameData.setFrameSet(`crouch-${frameSetId}`)
                                break
                            case frames.Stance.Airborne:
                                this.frameData.setFrameSet(`jump-${frameSetId}`)
                                break
                        }
                    }
                }
            }

            if (this.groundedNeutral) {
                switch (this.input.stick) {
                    case inputs.StickState.Down:
                    case inputs.StickState.DownForward:
                        this.frameData.setFrameSet('crouch')
                        break
                    case inputs.StickState.DownBack:
                        if (this.opponent.attacking) {
                            this.frameData.setFrameSet('crouch-block')
                        } else {
                            this.frameData.setFrameSet('crouch')
                        }
                        break
                    case inputs.StickState.Forward:
                        this.frameData.setFrameSet('walk-forward')
                        break
                    case inputs.StickState.Back:
                        if(this.opponent.attacking) {
                            this.frameData.setFrameSet('stand-block')
                        } else {
                            this.frameData.setFrameSet('walk-back')
                        }
                        break
                    case inputs.StickState.UpBack:
                        this.frameData.setFrameSet('jump-back')
                        break
                    case inputs.StickState.Up:
                        this.frameData.setFrameSet('jump-up')
                        break
                    case inputs.StickState.UpForward:
                        this.frameData.setFrameSet('jump-forward')
                        break
                    case inputs.StickState.Neutral:
                        this.frameData.setFrameSet('idle')
                        break
                }
            }

            processNormals(this.input.punch, 'punch')
            processNormals(this.input.kick, 'kick')

            // switch frame set
            if(prevKey != this.frameData.setKey) {
                this.frameData.setFrame(this)
            }

            this.frameData.update(this)
            const create = this.frameData.create
            if (create) {
                console.log('create ' + game.runtime())
                const projectile = new Projectile(create.clone(), this)
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
            this.faceRight = this.createdBy.faceRight

            this.frameData.setFrameSet('animation', this)
        }

        update(): void {
            this.frameData.update(this)
            console.log(this.frameData.frame.nextFrame)
        }
    }

    sprites.onDestroyed(SpriteKind.Projectile, sprite => {
        projectileList.removeElement(projectileList.find(projectile => projectile.sprite == sprite))
    })

    export function processBumps(p1: Fighter, p2: Fighter):void {
        const bumpBox:collisions.CollisionBox = new collisions.CollisionBox(0, 0, 12, 12)
        bumpBox.compute(p1, p1.box)
        bumpBox.compute(p2, p2.box)

        if (p1.box.collideWith(p2.box)) {
            const overlap = ((p1.box.width + p2.box.width) / 2 - Math.abs(p1.sprite.x - p2.sprite.x)) / 2
            if (p1.sprite.x > p2.sprite.x) {
                p1.sprite.x += overlap
                p2.sprite.x -= overlap
            } else {
                p1.sprite.x -= overlap
                p2.sprite.x += overlap
            }
        }
    }

    export function processHits(p1: Fighter, p2: Fighter):void {
        const p1Frame = p1.frameData.frame
        const p2Frame = p2.frameData.frame

        const registerHit = (attacker: Fighter, defender: Fighter):boolean => {
            if(!attacker.frameData.hitDone && !defender.frameData.frame.invincible && attacker.frameData.frame.hitbox) {
                attacker.frameData.frame.hitbox.compute(attacker, attacker.box)
                defender.frameData.frame.hurtbox.compute(defender, defender.box)
                if(attacker.box.collideWith(defender.box)) {
                    attacker.frameData.hitDone = true
                    return true
                }
            }
            return false
        }

        const p2Hit = registerHit(p1, p2)
        const p1Hit = registerHit(p2, p1)

        const resolveHit = (attackerFrame: frames.Frame, defender: Fighter) => {
            if (
                defender.action == frames.Action.Block
                && (
                    (attackerFrame.blockedHigh && defender.stance == frames.Stance.Stand)
                    || (attackerFrame.blockedLow && defender.stance == frames.Stance.Crouched)
                )
            ) {
                switch (defender.frameData.frame.stance) {
                    case frames.Stance.Stand:
                        defender.frameData.setFrameSet('stand-block-recover', defender)
                        break
                    case frames.Stance.Crouched:
                        defender.frameData.setFrameSet('crouch-block-recover', defender)
                        break
                }
                return
            }

            if(attackerFrame.knockdown) {
                defender.frameData.setFrameSet('jump-wound', defender)
                return
            }
            switch (defender.frameData.frame.stance) {
                case frames.Stance.Stand:
                    defender.frameData.setFrameSet('stand-wound', defender)
                    break
                case frames.Stance.Crouched:
                    defender.frameData.setFrameSet('crouch-wound', defender)
                    break
                case frames.Stance.Airborne:
                    defender.frameData.setFrameSet('jump-wound', defender)
                    break
            }
        }

        if(p1Hit) {
            resolveHit(p2Frame, p1)
        }
        if(p2Hit) {
            resolveHit(p1Frame, p2)
        }
    }

    export function processFlips(p1: Fighter, p2: Fighter): void {
        if (
            (p1.sprite.x > p2.sprite.x && p1.faceRight)
            || (p1.sprite.x < p2.sprite.x && !p1.faceRight)
        ) {
            p1.faceRight = !p1.faceRight
            p1.frameData.setFrame(p1)
            p2.faceRight = !p2.faceRight
            p2.frameData.setFrame(p2)
        }
    }
}