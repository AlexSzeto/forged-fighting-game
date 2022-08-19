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

    type Frame = FrameParams & {
        image: Image
        faceRight: boolean
    }

    type FrameSet = { [key: string]: Frame[] }

    export class FrameData {
        private sets: FrameSet
        private _setKey: string
        private frameIndex: number
        private done: boolean
        private timer: timers.Timer

        constructor() {
            this.sets = {}
            this.frameIndex = 0
            this.done = false
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
                    motion: params.motion ? true : (params.vx ? true : false) || (params.vy ? true : false),
                }

                return result
            })
        }

        get setKey(): string {
            return this._setKey
        }

        private get frame(): Frame {
            return this.sets[this._setKey][this.frameIndex]
        }

        update(sprite: Sprite, faceRight: boolean) {
            this.timer.update()
            if(!this.done) {
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
                            this.done = true
                        }
                    }

                    this.setFrame(sprite, faceRight)
                }
            }
        }

        setFrameSet(key: string, sprite: Sprite, faceRight: boolean) {
            if (this._setKey != key) {
                console.log('set ' + key)
                this._setKey = key
                this.frameIndex = 0
                this.done = false
                this.timer.elapsed = 0
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