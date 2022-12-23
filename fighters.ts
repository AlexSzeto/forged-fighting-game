namespace fighters {

    export type FighterData = {
        frameData: frames.FrameData
        grabData: GrabData[]
        specials: SpecialMoveData[]
    }

    export type SpecialMoveSharedData = {
        frameSetKey: string,
        ground: boolean,
        air: boolean
    }

    export type GrabData = {
        frameSetId: string
        range: number
        stance: frames.Stance
        opponentAirborne: boolean
    }

    export type SpecialMoveData = SpecialMoveSharedData & {
        motionInput: string
    }

    export type SpecialMoveTracker = SpecialMoveSharedData & {
        motion: inputs.MotionInput
    }

    const GROUND_PLANE_Y = 90 - 15
    const GRAVITY = 400

    const SPAWN_LEFT_X = 50
    const SPAWN_RIGHT_X = 100

    const HIT_STOP = 200
    const BLOCK_STOP = 100

    export class Fighter implements frames.FrameControlledSprite {
        opponent: Fighter
        
        // view
        sprite: Sprite
        faceRight: boolean

        // model
        frameData: frames.FrameData
        input: inputs.Input
        grabData: GrabData[]
        specials: SpecialMoveTracker[] = []

        // data cache
        ox: number = 0
        oy: number = 0

        constructor(data: FighterData, input: inputs.Input, spawnLeft: boolean) {
            this.frameData = data.frameData
            this.input = input
            this.grabData = data.grabData

            for(const specialMove of data.specials) {
                this.specials.push({
                    frameSetKey: specialMove.frameSetKey,
                    ground: specialMove.ground,
                    air: specialMove.air,
                    motion: new inputs.MotionInput(specialMove.motionInput),
                })
            }

            this.faceRight = spawnLeft

            this.sprite = sprites.create(assets.image`pixel`, SpriteKind.Player)
            this.sprite.setFlag(SpriteFlag.StayInScreen, true)

            if (spawnLeft) {
                this.sprite.x = SPAWN_LEFT_X
            } else {
                this.sprite.x = SPAWN_RIGHT_X
            }

            this.frameData.setFrameSet('idle', this)
            this.sprite.y = GROUND_PLANE_Y
        }
        
        get stance(): frames.Stance { return this.frameData.frame.stance }
        get action(): frames.Action { return this.frameData.frame.action }
        get neutral(): boolean { return this.frameData.frame.neutral }
        get attacking(): boolean { return this.action == frames.Action.Attack }
        get airborne(): boolean { return this.frameData.frame.stance == frames.Stance.Airborne }

        get groundedNeutral(): boolean { return this.neutral && !this.airborne }

        get frame(): frames.Frame { return this.frameData.frame }

        processInput(): void {
            this.input.update(this.faceRight)
            const prevKey = this.frameData.setKey

            // FRAME SET RESET
            if(this.frameData.done) {                
                // TODO: air recovery
                this.frameData.setFrameSet('idle', this)
                this.sprite.y = GROUND_PLANE_Y
            }

            // LANDING
            if (this.airborne) {
                if (this.sprite.vy > 0 && this.sprite.y - this.oy >= GROUND_PLANE_Y) {
                    this.sprite.ay = 0
                    this.sprite.vy = 0

                    if (this.frameData.setKey == 'jump-wound') {
                        this.frameData.setFrameSet('prone', this)
                    } else {
                        this.frameData.setFrameSet('idle', this)
                        this.sprite.y = GROUND_PLANE_Y
                    }
                } else {
                    this.sprite.ay = GRAVITY * this.sprite.scale
                }
            }

            // TURNING
            if (
                this.groundedNeutral && (
                (this.sprite.x > this.opponent.sprite.x && this.faceRight)
                || (this.sprite.x < this.opponent.sprite.x && !this.faceRight)
                )
            ) {
                this.faceRight = !this.faceRight
                this.frameData.setFrame(this)
                // this.opponent.faceRight = !this.opponent.faceRight
                // this.opponent.frameData.setFrame(this)
            }


            if(this.sprite.x < 20) {
                this.sprite.x = 20
            }

            if(this.sprite.x > scene.screenWidth() - 20) {
                this.sprite.x = scene.screenWidth() - 20
            }

            if(
                (this.action == frames.Action.Pain || this.action == frames.Action.Block)
                && !this.airborne
            ) {
                this.sprite.fx = 40
            } else {
                this.sprite.fx = 0
            }

            if(this.action == frames.Action.Throw && this.opponent.action == frames.Action.Choke) {
                this.opponent.frameData.setFrameSet('jump-wound', this.opponent)
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
                        for(const grabData of this.grabData) {
                            if (
                                this.stance == grabData.stance
                                && frameSetId == grabData.frameSetId
                                && this.opponent.airborne == grabData.opponentAirborne
                                && this.frameData.frame.hurtbox != null
                                && this.opponent.frameData.frame.hurtbox != null
                                && Math.abs(this.sprite.x - this.opponent.sprite.x) < this.frameData.frame.hurtbox.width / 2 + this.opponent.frameData.frame.hurtbox.width / 2 + grabData.range
                            ) {
                                this.frameData.setFrameSet('grab')
                                this.opponent.frameData.setFrameSet('choke', this.opponent)
                                return
                            }
                        }
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
                        if (this.opponent.attacking || hasProjectileThreat(this)) {
                            this.frameData.setFrameSet('crouch-block')
                        } else {
                            this.frameData.setFrameSet('crouch')
                        }
                        break
                    case inputs.StickState.Forward:
                        this.frameData.setFrameSet('walk-forward')
                        break
                    case inputs.StickState.Back:
                        if (this.opponent.attacking || hasProjectileThreat(this)) {
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
                const projectile = new Projectile(create, this)
                projectile.sprite.z = 20
                
            }
        }

        resolveHit(attackerFrame: frames.Frame) {
            if (
                this.action == frames.Action.Block
                && (
                    (attackerFrame.blockedHigh && this.stance == frames.Stance.Stand)
                    || (attackerFrame.blockedLow && this.stance == frames.Stance.Crouched)
                )
            ) {
                this.sprite.z = 10
                switch (this.frameData.frame.stance) {
                    case frames.Stance.Stand:
                        this.frameData.setFrameSet('stand-block-recover', this)
                        break
                    case frames.Stance.Crouched:
                        this.frameData.setFrameSet('crouch-block-recover', this)
                        break
                }
                return
            }

            if (attackerFrame.knockdown) {
                this.frameData.setFrameSet('jump-wound', this)
                return
            }

            // temp set same frameset fix
            
            switch (this.frameData.frame.stance) {
                case frames.Stance.Stand:
                    this.frameData.setFrameSet('stand-wound', this, true)
                    break
                case frames.Stance.Crouched:
                    this.frameData.setFrameSet('crouch-wound', this, true)
                    break
                case frames.Stance.Airborne:
                    this.frameData.setFrameSet('jump-wound', this, true)
                    break
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
            public frameData: frames.FrameData,
            public createdBy: Fighter
        ) {
            this.sprite = sprites.create(assets.image`pixel`, SpriteKind.Projectile)
            projectileList.push(this)
            this.sprite.setFlag(SpriteFlag.AutoDestroy, true)
            this.sprite.x = this.createdBy.sprite.x
            this.sprite.y = this.createdBy.sprite.y
            this.faceRight = this.createdBy.faceRight

            this.frameData.setFrameSet('active', this)
        }

        get active() {
            return this.frameData.frame.action == frames.Action.Attack
        }

        update(): void {
            this.frameData.update(this)
            if(this.frameData.done) {
                this.sprite.destroy()
            }
        }

        cancel(): void {
            if(!this.frameData.frame.invincible) {
                this.frameData.setFrameSet('death', this)
            }
        }

        processCancel(target: Projectile) {
            if(this != target && this.createdBy != target.createdBy && this.active && target.active) {
                this.frameData.frame.hitbox.compute(this, collisions.box1)
                target.frameData.frame.hitbox.compute(target, collisions.box2)
                if(collisions.box1.collideWith(collisions.box2)) {
                    this.cancel()
                    target.cancel()
                }
            }
            
        }

        processHit(target: Fighter) {
            if (this.createdBy != target && this.active && !target.frameData.frame.invincible) {
                this.frameData.frame.hitbox.compute(this, collisions.box1)
                target.frameData.frame.hurtbox.compute(target, collisions.box2)
                if(collisions.box1.collideWith(collisions.box2)) {
                    target.resolveHit(this.frameData.frame)
                    this.cancel()
                }
            }
        }
    }

    sprites.onDestroyed(SpriteKind.Projectile, sprite => {
        projectileList.removeElement(projectileList.find(projectile => projectile.sprite == sprite))
    })

    export function hasProjectileThreat(target: Fighter):boolean {
        return projectileList.some(projectile => projectile.createdBy != target && projectile.active)
    }

    export function processBumps(p1: Fighter, p2: Fighter):void {
        const bumpBox:collisions.CollisionBox = new collisions.CollisionBox(0, 0, 12, 12)
        bumpBox.compute(p1, collisions.box1)
        bumpBox.compute(p2, collisions.box2)

        if (collisions.box1.collideWith(collisions.box2)) {
            const overlap = ((collisions.box1.width + collisions.box2.width) / 2 - Math.abs(p1.sprite.x - p2.sprite.x)) / 2
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
                attacker.frameData.frame.hitbox.compute(attacker, collisions.box1)
                defender.frameData.frame.hurtbox.compute(defender, collisions.box2)
                if (collisions.box1.collideWith(collisions.box2)) {
                    attacker.frameData.hitDone = true
                    attacker.sprite.z = 20
                    return true
                }
            }
            return false
        }

        const p2Hit = registerHit(p1, p2)
        const p1Hit = registerHit(p2, p1)

        if(p1Hit) {
            p1.resolveHit(p2Frame)
        }
        if(p2Hit) {
            p2.resolveHit(p1Frame)
        }

        if (p1Hit || p2Hit) {
            p1.frameData.pause(p1, HIT_STOP)
            p2.frameData.pause(p2, HIT_STOP)
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