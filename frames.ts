namespace frames {
    export enum Stance {
        Stand,
        Crouched,
        Airborne,
    }

    export enum Action {
        Neutral,
        Block,
        Pain,
        Punch,
        Kick,
        Grab,
        Throw,
        Choke,
        Special,
        Attack,
    }

    type FrameParams = {
        frameIndex?: number

        // animation
        duration?: number
        nextFrame?: number

        // positioning
        ox?: number
        oy?: number

        // motion
        vx?: number
        vy?: number
        motion?: boolean

        // fight attributes
        neutral?: boolean
        invincible?: boolean
        stance?: Stance
        action?: Action

        create?: FrameData

        hitbox?: collisions.CollisionBox
        hurtbox?: collisions.CollisionBox

        damage?: number
        blockedHigh?: boolean
        blockedLow?: boolean
        knockdown?: boolean
    }

    export type Frame = {
        duration: number
        nextFrame: number
        ox: number
        oy: number
        vx: number
        vy: number
        motion: boolean
        neutral: boolean
        invincible: boolean
        stance: Stance
        action: Action
        create: FrameData
        hitbox: collisions.CollisionBox
        hurtbox: collisions.CollisionBox
        damage: number
        blockedHigh: boolean
        blockedLow: boolean
        knockdown: boolean

        image: Image
        faceRight: boolean
    }

    type FrameSet = { [key: string]: Frame[] }
    type InsertFrameSetData = {
        key: string
        animation: Image[]
        data: FrameParams[]
        projectileDefaults: boolean
    }

    export interface FrameControlledSprite {
        sprite: Sprite
        faceRight: boolean
        ox: number
        oy: number
    }

    export class FrameData {
        private sets: FrameSet
        private _setKey: string
        private _done: boolean
        private _create: FrameData
        private frameIndex: number
        private timer: timers.Timer

        hitDone: boolean = false

        constructor() {
            this.sets = {}
            this.frameIndex = 0
            this._done = false
            this.timer = new timers.Timer()
        }

        clone(): FrameData {
            const result = new FrameData()
            result.sets = this.sets
            return result
        }

        addFrameSet(key: string, animation: Image[], data: FrameParams[], projectileDefaults: boolean = false, clone: boolean = false): void {
            const prevParams: FrameParams = {
                action: Action.Neutral,
                stance: Stance.Stand,
                neutral: false,
                ox: 0,
                oy: 0
            }

            this.sets[key] = data.map((params, index) => {
                const image = params.frameIndex != null ? animation[params.frameIndex] : animation[index]
                const result: Frame = {
                    image: image,
                    faceRight: false,

                    duration: params.duration != undefined ? params.duration : 200,
                    nextFrame: params.nextFrame != undefined ? params.nextFrame : index + 1,
                    ox: params.ox != undefined ? params.ox : prevParams.ox,
                    oy: params.oy != undefined ? params.oy : prevParams.oy,
                    vx: params.vx != undefined ? params.vx : 0,
                    vy: params.vy != undefined ? params.vy : 0,

                    hitbox: params.hitbox != undefined
                        ? params.hitbox
                        : (projectileDefaults ? new collisions.CollisionBox(0, 0, image.width, image.height) : null),
                    hurtbox: params.hurtbox != undefined
                        ? params.hurtbox
                        : new collisions.CollisionBox(0, 0, image.width, image.height),

                    neutral: params.neutral != undefined ? params.neutral : prevParams.neutral,
                    invincible: params.invincible != undefined ? params.invincible : false,
                    stance: params.stance != undefined ? params.stance : prevParams.stance,
                    action: params.action != undefined ? params.action : prevParams.action,
                    damage: params.damage != undefined ? params.damage : 0,
                    blockedHigh: params.blockedHigh != undefined ? params.blockedHigh : true,
                    blockedLow: params.blockedLow != undefined ? params.blockedLow : true,
                    knockdown: params.knockdown != undefined ? params.knockdown : false,
                    create: params.create != undefined ? params.create : null,
                    motion: (params.motion !== undefined)
                        ? params.motion
                        : (index == 0) || (params.vx !== undefined) || (params.vy !== undefined),
                }

                prevParams.stance = result.stance
                prevParams.action = result.action
                prevParams.neutral = result.neutral
                prevParams.ox = result.ox
                prevParams.oy = result.oy

                return result
            })
        }

        get setKey(): string {
            return this._setKey
        }

        get done(): boolean {
            return this._done
        }

        get create(): FrameData {
            return this._create
        }

        get frame(): Frame {
            if(!this.sets[this._setKey]) {
                console.log(`set not found: <${this._setKey}>`)                
            } else if(this.frameIndex >= this.sets[this._setKey].length) {
                console.log(`frame ${this.frameIndex} not in set ${this.setKey}`)
            }
            return this.sets[this._setKey][this.frameIndex]
        }

        update(target: FrameControlledSprite) {
            this._create = null
            this.timer.update()
            if(!this._done) {
                const currentSet = this.sets[this._setKey]
                const currentFrame = this.frame
                if(currentFrame.duration > 0 && this.timer.elapsed >= currentFrame.duration) {
                    this.timer.elapsed -= currentFrame.duration

                    if (currentFrame.nextFrame < 0 || currentFrame.nextFrame >= currentSet.length) {
                        this._done = true
                    } else {
                        this.frameIndex = currentFrame.nextFrame
                    }

                    this.setFrame(target)
                }
            }
        }

        setFrameSet(key: string, target: FrameControlledSprite = null, restartSameSet: boolean = false) {
            if (this._setKey != key || restartSameSet) {
                this._setKey = key
                this.frameIndex = 0
                this._done = false
                this.hitDone = false
                this.timer.elapsed = 0
                if(target) {
                    this.setFrame(target)
                }
            }
        }

        setFrame(target: FrameControlledSprite) {
            const nextFrame = this.frame

            if(nextFrame.create) {
                this._create = nextFrame.create
            }

            if (nextFrame.faceRight != target.faceRight) {
                nextFrame.image.flipX()
                nextFrame.faceRight = target.faceRight
            }

            target.sprite.x += target.sprite.image.width / 2
            target.sprite.setImage(nextFrame.image)
            target.sprite.x -= nextFrame.image.width / 2

            target.sprite.x -= target.ox
            target.sprite.y -= target.oy
            target.ox = (target.faceRight ? nextFrame.ox : -nextFrame.ox) * target.sprite.scale
            target.oy = nextFrame.oy * target.sprite.scale
            target.sprite.x += target.ox
            target.sprite.y += target.oy

            if(nextFrame.motion) {
                target.sprite.vx = (target.faceRight ? nextFrame.vx : -nextFrame.vx) * target.sprite.scale
                target.sprite.vy = nextFrame.vy * target.sprite.scale
            }
        }
    }


}