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

class Frame {
    image: Image
    flipped: boolean
    hitbox: CollisionBox
    hurtbox: CollisionBox

    invincible: boolean
    damage: number    
}

interface FighterData {
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

        this.sprite = sprites.create(this.frame.image, SpriteKind.Player)
    }

    get frame():Frame { return this.frameData[this.currentFrame] }

    update(): void {

    }
}

const test:Sprite = sprites.create(assets.image`test`)
const flipTest = assets.image`test`.clone()
flipTest.flipX()
const test2: Sprite = sprites.create(flipTest)

test.x += scene.screenWidth() / 4
test2.x -= scene.screenWidth() / 4