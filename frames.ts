namespace frames {

    const FrameParamsKeys = [
        'duration',
        'loop',
        'vx',
        'vy'
    ]

    type FrameParams = {
        duration?: number
        loop?: boolean

        vx?: number
        vy?: number

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
        private setKey: string
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
                const result: Frame = {
                    image,
                    faceRight: false,

                    duration: 200,
                    loop: true,
                    vx: 0,
                    vy: 0,
                }

                // // hard coding object keys to get around a destructuring bug
                // for(const key of FrameParamsKeys) {
                //     if(data[index][key]) {
                //         result[key] = data[index][key]
                //     }
                // }

                return result
            })
        }

        get frameSet(): Frame[] {
            return this.sets[this.setKey]
        }

        get frame(): Frame {
            return this.sets[this.setKey][this.frameIndex]
        }

        update(sprite: Sprite, faceRight: boolean) {
            this.timer.update()
            if(!this.done) {
                const currentSet = this.frameSet
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
            if (this.setKey != key) {
                this.setKey = key
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

            sprite.vx = faceRight ? nextFrame.vx : -nextFrame.vx
            sprite.vy = nextFrame.vy
        }
    }


}