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

enum FighterState {
    Idle,
    Walk,
    Punch,
    Kick,
    Crouch,
    CrouchPunch,
    CrouchKick,
    Jump,
    JumpPunch,
    JumpKick,
}

enum FighterInput {
    Neutral,
    Forward,
    Back,
    Down,
    DownForward,
    DownBack,
    Up,
    UpForward,
    UpBack,
    Punch,
    Kick
}

type Frame = {
    images: Image[]
    looping: boolean
    flipped: boolean

    // hitbox: CollisionBox
    // hurtbox: CollisionBox

    // invincible: boolean
    // damage: number    
}

type FrameData = { [key: string]: Frame }

type FighterData = {
    health: number
    frameData: FrameData
}

class Fighter {
    sprite: Sprite
    healthBar: Sprite
    frameData: FrameData
    currentFrame: string

    flipped: boolean
    state: FighterState
    input: FighterInput


    constructor(data: FighterData, spawnOnLeft: boolean) {
        this.frameData = data.frameData

        this.currentFrame = 'idle'
        this.state = FighterState.Idle
        this.input = FighterInput.Neutral
        this.flipped = spawnOnLeft

        this.sprite = sprites.create(assets.image`pixel`, SpriteKind.Player)
        this.sprite.setFlag(SpriteFlag.StayInScreen, true)
        this.sprite.ay = 200
        animation.runImageAnimation(this.sprite, this.frame.images, 200, false)

        if(spawnOnLeft) {
            this.sprite.x = 40
        } else {
            this.sprite.x = 100
        }

        this.adjustFrame()
    }

    get frame():Frame { return this.frameData[this.currentFrame] }

    adjustFrame(): void {
        if(this.frame.flipped != this.flipped) {
            this.frame.flipped = this.flipped
            for(let image of this.frame.images) {
                image.flipX()
            }
        }
    }

    update(): void {
        let nextState = this.state

        // parse input
        switch(this.input) {
            case FighterInput.Forward:
                this.sprite.vx = this.flipped ? 100 : -100
                nextState = FighterState.Walk
                break
            case FighterInput.Back:
                this.sprite.vx = this.flipped ? -50 : 50
                nextState = FighterState.Walk
                break
            case FighterInput.Neutral:
                if(nextState == FighterState.Walk) {
                    this.sprite.vx = 0
                    nextState = FighterState.Idle
                }
                break
        }
        this.input = FighterInput.Neutral

        if(this.state != nextState) {
            switch(nextState) {
                case FighterState.Idle:
                    this.currentFrame = 'idle'
                    break
                case FighterState.Walk:
                    this.currentFrame = 'walk'
                    break
            }
            animation.runImageAnimation(this.sprite, this.frame.images, 200, this.frame.looping)
            this.adjustFrame()
            this.state = nextState
        }
    }
}

const p1data:FighterData = {
    health: 100,
    frameData: {
        'idle': {
            images: assets.animation`lyndsay-idle`,
            looping: false,
            flipped: false,
        },
        'walk': {
            images: assets.animation`lyndsay-walk`,
            looping: true,
            flipped: false,
        }
    }
}

const p2data: FighterData = {
    health: 100,
    frameData: {
        'idle': {
            images: assets.animation`lyndsay-idle`,
            looping: false,
            flipped: false,
        },
        'walk': {
            images: assets.animation`lyndsay-walk`,
            looping: true,
            flipped: false,
        }
    }
}

const p1 = new Fighter(p1data, true)
const p2 = new Fighter(p2data, false)

game.onUpdate(() => {
    if(controller.left.isPressed()) {
        p1.input = FighterInput.Back
    }
    if (controller.right.isPressed()) {
        p1.input = FighterInput.Forward
    }

    p1.update()
})