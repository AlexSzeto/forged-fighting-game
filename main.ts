class Rectangle {
    x: number
    y: number
    width: number
    height: number

    get left(): number { return this.x }
    get right(): number { return this.x + this.width }
    get top(): number { return this.y }
    get bottom(): number { return this.y + this.height }

    constructor(x: number, y: number, width: number, height: number, flipped: boolean = false) {
        this.x = flipped ? x - width : x
        this.y = y
        this.width = width
        this.height = height
    }

    collideWith(target: Rectangle): boolean {
        return (target.right >= this.left && target.left <= this.right && target.bottom >= this.top && target.top <= this.bottom)
    }
}

class CollisionBox extends Rectangle{
    calculate(base: Sprite, flipped: boolean) {
        return new Rectangle(
            base.x + this.x * (flipped ? -1 : 1),
            base.y + this.y,
            this.width,
            this.height,
            flipped
        )
    }
}

type Frame = {
    images: Image[]
    flipped: boolean
    hitbox: CollisionBox
    hurtbox: CollisionBox

    invincible: boolean
    damage: number    
}

type FighterData = {
    health: number
    frameData: Frame[]
}

class Fighter {
    sprite: Sprite
    healthBar: Sprite
    frameData: Frame[]
    currentFrame: number
    flipped: boolean
    updatePriority: number

    constructor(data: FighterData, spawnOnLeft: boolean) {
        this.frameData = data.frameData

        this.currentFrame = 0
        this.flipped = false

        this.sprite = sprites.create(assets.image`pixel`, SpriteKind.Player)
        animation.runImageAnimation(this.sprite, this.frame.images, 200, false)

        if(spawnOnLeft) {
            this.sprite.x = 40
            for(let image of this.frame.images) {
                image.flipX()
            }
        } else {
            this.sprite.x = 120
        }
    }

    get frame():Frame { return this.frameData[this.currentFrame] }

    update(): void {

    }
}

const p1data:FighterData = {
    health: 100,
    frameData: [
        {
            images: assets.animation`lyndsay-idle`,
            flipped: false,
            hitbox: null,
            hurtbox: null,
            invincible: false,
            damage: 0
        }
    ]
}

const p2data: FighterData = {
    health: 100,
    frameData: [
        {
            images: assets.animation`lyndsay-idle`,
            flipped: false,
            hitbox: null,
            hurtbox: null,
            invincible: false,
            damage: 0
        }
    ]
}

const p1 = new Fighter(p1data, true)
const p2 = new Fighter(p2data, false)