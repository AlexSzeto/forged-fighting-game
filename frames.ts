namespace frames {

    type FrameParams = {
        frameIndex?: number

        duration?: number
        loop?: boolean

        ox?: number
        oy?: number

        vx?: number
        vy?: number
        motion?: boolean

        create?: FrameData

        hitbox?: collisions.CollisionBox
        hurtbox?: collisions.CollisionBox

        // invincible: boolean
        // damage: number    
    }

    type Frame = {
        duration: number
        loop: boolean

        ox: number
        oy: number

        vx: number
        vy: number
        motion: boolean

        hitbox: collisions.CollisionBox
        hurtbox: collisions.CollisionBox

        create: FrameData

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

        private setInsertData: InsertFrameSetData[] = []

        constructor() {
            this.sets = {}
            this.frameIndex = 0
            this._done = false
            this.timer = new timers.Timer()
        }

        clone(): FrameData {
            const result = new FrameData()
            for(const data of this.setInsertData) {
                result.addFrameSet(data.key, data.animation, data.data, data.projectileDefaults)
            }
            return result
        }

        addFrameSet(key: string, animation: Image[], data: FrameParams[], projectileDefaults: boolean = false): void {
            this.setInsertData.push({
                key,
                animation,
                data,
                projectileDefaults
            })

            this.sets[key] = data.map((params, index) => {
                const image = params.frameIndex ? animation[params.frameIndex] : animation[index]
                const result: Frame = {
                    image: image.clone(),
                    faceRight: false,

                    duration: params.duration ? params.duration : 200,
                    loop: params.loop ? params.loop : false,
                    ox: params.ox ? params.ox : 0,
                    oy: params.oy ? params.oy : 0,
                    vx: params.vx ? params.vx : 0,
                    vy: params.vy ? params.vy : 0,

                    hitbox: params.hitbox
                        ? params.hitbox
                        : (projectileDefaults ? new collisions.CollisionBox(0, 0, image.width, image.height) : null),
                    hurtbox: params.hurtbox
                        ? params.hurtbox
                        : (projectileDefaults ? null : new collisions.CollisionBox(0, 0, image.width, image.height)),
                    
                    create: params.create ? params.create : null,
                    motion: (params.motion !== undefined)
                        ? params.motion
                        : (index == 0) || (params.vx !== undefined) || (params.vy !== undefined),
                }

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
                if(this.timer.elapsed >= currentFrame.duration) {
                    this.timer.elapsed -= currentFrame.duration
                    this.frameIndex++

                    if(this.frameIndex >= currentSet.length) {
                        if(currentFrame.loop) {
                            this.frameIndex = 0
                        } else {
                            this.frameIndex = currentSet.length - 1
                            this._done = true
                        }
                    }

                    this.setFrame(target)
                }
            }
        }

        setFrameSet(key: string, target: FrameControlledSprite) {
            if (this._setKey != key) {
                this._setKey = key
                this.frameIndex = 0
                this._done = false
                this.timer.elapsed = 0
                if(target.sprite == null) {
                    console.log('no sprite?')
                }
                this.setFrame(target)
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
            target.sprite.setImage(nextFrame.image)

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