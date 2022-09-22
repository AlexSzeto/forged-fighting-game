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
        imageIndex?: number

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

        // attributes
        neutral?: boolean
        invincible?: boolean
        stance?: Stance
        action?: Action

        // projectile
        create?: FrameData

        // dimensions
        hitbox?: collisions.CollisionBox
        hurtbox?: collisions.CollisionBox

        // hit attributes
        damage?: number
        blockedHigh?: boolean
        blockedLow?: boolean
        knockdown?: boolean
    }

    export type Frame = {
        imageIndex: number
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
    }

    type FrameSetImage = {
        image: Image
        faceRight: boolean
    }

    type FrameSet = {
        images: FrameSetImage[]
        frames: Frame[]
    }
    type FrameSetList = { [key: string]: FrameSet }

    export class FrameControlledSprite {
        sprite: Sprite
        faceRight: boolean
        ox: number
        oy: number
    }

    export class FrameData {
        private sets: FrameSetList
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

        addSet(key: string, animation: Image[], data: FrameParams[], projectileDefaults: boolean = false, clone: boolean = false): void {
            const prevParams: FrameParams = {
                ox: 0,
                oy: 0,
                neutral: false,
                stance: Stance.Stand,
                action: Action.Neutral,
                hurtbox: undefined,
            }

            this.sets[key] = {
                images: animation.map(image => ({
                    image: image,
                    faceRight: false,
                })),
                frames: data.map((params, index) => {
                    const imageIndex = params.imageIndex != undefined ? params.imageIndex : index
                    const image = animation[imageIndex]
                    const result: Frame = {
                        imageIndex: imageIndex,
                        duration: params.duration != undefined ? params.duration : 200,
                        nextFrame: params.nextFrame != undefined ? params.nextFrame : index + 1,

                        ox: params.ox != undefined ? params.ox : prevParams.ox,
                        oy: params.oy != undefined ? params.oy : prevParams.oy,

                        motion: (params.motion !== undefined)
                            ? params.motion
                            : (index == 0) || (params.vx !== undefined) || (params.vy !== undefined),
                        vx: params.vx != undefined ? params.vx : 0,
                        vy: params.vy != undefined ? params.vy : 0,

                        hitbox: params.hitbox != undefined
                            ? params.hitbox
                            : (projectileDefaults ? new collisions.CollisionBox(0, 0, image.width, image.height) : null),
                        hurtbox: params.hurtbox != undefined
                            ? params.hurtbox
                            : prevParams.hurtbox != undefined
                                ? prevParams.hurtbox
                                : new collisions.CollisionBox(0, 0, image.width, image.height),

                        neutral: params.neutral != undefined ? params.neutral : prevParams.neutral,
                        invincible: params.invincible != undefined ? params.invincible : false,
                        stance: params.stance != undefined ? params.stance : prevParams.stance,
                        action: params.action != undefined ? params.action : prevParams.action,

                        create: params.create != undefined ? params.create : null,

                        damage: params.damage != undefined ? params.damage : 0,
                        blockedHigh: params.blockedHigh != undefined ? params.blockedHigh : true,
                        blockedLow: params.blockedLow != undefined ? params.blockedLow : true,
                        knockdown: params.knockdown != undefined ? params.knockdown : false,
                    }

                    prevParams.stance = result.stance
                    prevParams.action = result.action
                    prevParams.neutral = result.neutral
                    prevParams.hurtbox = result.hurtbox
                    prevParams.ox = result.ox
                    prevParams.oy = result.oy

                    return result
                })
            }
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
            // if(!this.sets[this._setKey]) {
            //     console.log(`set not found: <${this._setKey}>`)                
            // } else if(this.frameIndex >= this.sets[this._setKey].frames.length) {
            //     console.log(`frame ${this.frameIndex} not in set ${this.setKey}`)
            // }
            return this.sets[this._setKey].frames[this.frameIndex]
        }

        get image(): FrameSetImage {
            return this.sets[this._setKey].images[this.frame.imageIndex]
        }

        update(target: FrameControlledSprite) {
            this._create = null
            this.timer.update()
            if(!this._done) {
                const currentSet = this.sets[this._setKey]
                const currentFrame = this.frame
                if(currentFrame.duration > 0 && this.timer.elapsed >= currentFrame.duration) {
                    this.timer.elapsed -= currentFrame.duration

                    if (currentFrame.nextFrame < 0 || currentFrame.nextFrame >= currentSet.frames.length) {
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
            const nextImage = this.image

            if(nextFrame.create) {
                this._create = nextFrame.create
            }

            if (nextImage.faceRight != target.faceRight) {
                nextImage.image.flipX()
                nextImage.faceRight = target.faceRight
            }

            target.sprite.setImage(nextImage.image)
            const imageOffset = -nextImage.image.width / 2

            target.sprite.x -= target.ox
            target.sprite.y -= target.oy
            target.ox = Math.floor(((target.faceRight ? nextFrame.ox : -nextFrame.ox) + imageOffset) * target.sprite.scale)
            target.oy = Math.floor(nextFrame.oy * target.sprite.scale)
            target.sprite.x += target.ox
            target.sprite.y += target.oy

            if(nextFrame.motion) {
                target.sprite.vx = (target.faceRight ? nextFrame.vx : -nextFrame.vx) * target.sprite.scale
                target.sprite.vy = nextFrame.vy * target.sprite.scale
            }
        }
    }


}