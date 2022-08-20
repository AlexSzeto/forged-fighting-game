namespace frames {

    type FrameParams = {
        duration?: number
        loop?: boolean

        vx?: number
        vy?: number
        motion?: boolean

        // hitbox: CollisionBox
        // hurtbox: CollisionBox

        // invincible: boolean
        // damage: number    
    }

    type Frame = {
        duration: number
        loop: boolean

        vx: number
        vy: number
        motion: boolean

        image: Image
        faceRight: boolean
    }

    type FrameSet = { [key: string]: Frame[] }

    export class FrameData {
        private sets: FrameSet
        private _setKey: string
        private _done: boolean
        private frameIndex: number
        private timer: timers.Timer

        constructor() {
            this.sets = {}
            this.frameIndex = 0
            this._done = false
            this.timer = new timers.Timer()
        }

        addFrameSet(key: string, animation: Image[], data: FrameParams[]): void {
            this.sets[key] = animation.map((image, index) => {
                const params = data[index]
                const result: Frame = {
                    image,
                    faceRight: false,

                    duration: params.duration ? params.duration : 200,
                    loop: params.loop ? params.loop : false,
                    vx: params.vx ? params.vx : 0,
                    vy: params.vy ? params.vy : 0,
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

        private get frame(): Frame {
            if(!this.sets[this._setKey]) {
                console.log(`set not found: <${this._setKey}>`)                
            } else if(this.frameIndex >= this.sets[this._setKey].length) {
                console.log(`frame ${this.frameIndex} not in set ${this.setKey}`)
            }
            return this.sets[this._setKey][this.frameIndex]
        }

        update(sprite: Sprite, faceRight: boolean) {
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

                    this.setFrame(sprite, faceRight)
                }
            }
        }

        setFrameSet(key: string, sprite: Sprite, faceRight: boolean) {
            if (this._setKey != key) {
                this._setKey = key
                this.frameIndex = 0
                this._done = false
                this.timer.elapsed = 0
                if(sprite == null) {
                    console.log('no sprite?')
                }
                this.setFrame(sprite, faceRight)
            }
        }

        setFrame(sprite: Sprite, faceRight: boolean) {
            const nextFrame = this.frame
            if (nextFrame.faceRight != faceRight) {
                nextFrame.image.flipX()
                nextFrame.faceRight = faceRight
            }
            sprite.setImage(nextFrame.image)

            if(nextFrame.motion) {
                sprite.vx = (faceRight ? nextFrame.vx : -nextFrame.vx) * sprite.scale
                sprite.vy = nextFrame.vy * sprite.scale
            }
        }
    }


}