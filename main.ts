namespace collision {
    export type Point = {
        x: number
        y: number
    }

    export type Box = Point & {
        width: number
        height: number
    }

    export function getCollision(a: Box, b: Box): Box | null {
        const left = (box: Box) => box.x
        const top = (box: Box) => box.y
        const right = (box: Box) => box.x + box.width
        const bottom = (box: Box) => box.y + box.height

        const x = Math.max(left(a), left(b))
        const y = Math.max(top(a), top(b))

        return (
            right(b) >= left(a)
            && left(b) <= right(a)
            && bottom(b) >= top(a)
            && top(b) <= bottom(a)
        ) ? {
            x,
            y,
            width: Math.min(right(a), right(b)) - x,
            height: Math.min(bottom(a), bottom(b)) - y
         } : null
    }
}

namespace frame {
    export type Crop = {
        left: number
        right: number
        top: number
        bottom: number
    }

    export type Setting = {
        frameIndex: number

        offset: collision.Point
        hurtCrop: Crop
    }

    export type FrameOffset = {
        image: collision.Point
        hurtbox: collision.Box
    }

    export type FrameData = {
        image: Image
        flipped: boolean

        offset: FrameOffset
        flippedOffset: FrameOffset
    }

    export type LinkedSprite = collision.Point & {
        flipped: boolean
        sprite: Sprite
        data: FrameData
    }

    export function compileFrame(animation: Image[], setting: Setting) : FrameData {
        const image: Image = animation[setting.frameIndex]

        const compileOffset = (fx: number): FrameOffset => ({
            image: {
                x: setting.offset.x * fx,
                y: setting.offset.y - Math.floor(image.height / 2)
            },
            hurtbox: {
                x: setting.offset.x * fx - image.width / 2 + setting.hurtCrop.left,
                y: setting.offset.y - image.height + setting.hurtCrop.top,
                width: image.width - setting.hurtCrop.left - setting.hurtCrop.right,
                height: image.height - setting.hurtCrop.top - setting.hurtCrop.bottom
            }
        })

        return {
            image,
            flipped: false,

            offset: compileOffset(1),
            flippedOffset: compileOffset(-1)
        }
    }
}

namespace frameDebug {
    export class Debugger {
        sprite: Sprite
        buffer: Image

        constructor() {
            this.buffer = image.create(scene.screenWidth(), scene.screenHeight())
            this.sprite = sprites.create(this.buffer, SpriteKind.create())
            this.sprite.z = 1000
        }

        paint(frameSprite: frame.LinkedSprite, box: collision.Box, color: number) {
            if (!!box) {
                this.buffer.drawRect(
                    frameSprite.x + box.x,
                    frameSprite.y + box.y,
                    box.width,
                    box.height,
                    color
                )
            }
        }

        clear() {
            this.buffer.fill(0)
        }
    }
}

let setting: frame.Setting = {
    frameIndex: 0,

    offset: { x: -7, y: -1 },
    hurtCrop: { left: 0, top: 0, right: 0, bottom: 0 }
}


// Add your code here
scene.setBackgroundColor(1)

let sprite = sprites.create(assets.image`pixel`, SpriteKind.Player)
let data = frame.compileFrame( assets.animation`lyndsay-idle`, setting)
let crosshair = sprites.create(assets.image`crosshair`, SpriteKind.Player)
crosshair.z = 1500

let linkedSprite: frame.LinkedSprite = {
    x: crosshair.x,
    y: crosshair.y,
    flipped: false,
    sprite,
    data
}

// linkedSprite.data.image.flipX()
// sprite.setImage(linkedSprite.data.image)
// sprite.x = linkedSprite.x + linkedSprite.data.flippedOffset.image.x
// sprite.y = linkedSprite.y + linkedSprite.data.flippedOffset.image.y

// let frameDebugger = new frameDebug.Debugger()
// frameDebugger.paint(linkedSprite, linkedSprite.data.flippedOffset.hurtbox, 2)


sprite.setImage(linkedSprite.data.image)

crosshair.vx = 20
crosshair.fx = 10

crosshair.vy = 20
crosshair.fy = 10

let frameDebugger = new frameDebug.Debugger()

game.onUpdate(() => {
    linkedSprite.x = Math.floor(crosshair.x)
    linkedSprite.y = Math.floor(crosshair.y)
    sprite.x = linkedSprite.x + linkedSprite.data.offset.image.x
    sprite.y = linkedSprite.y + linkedSprite.data.offset.image.y

    frameDebugger.clear()
    frameDebugger.paint(linkedSprite, linkedSprite.data.offset.hurtbox, 2)
})


