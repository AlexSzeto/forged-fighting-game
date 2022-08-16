namespace timer {
    export class Clock {
        private timer: number
        elapsed: number
        trackers: Tracker[]

        constructor() {
            this.timer = game.runtime()
            this.trackers = []
        }

        addTracker(period: number): Tracker {
            const tracker = new Tracker(period)
            this.trackers.push(tracker)
            return tracker
        }

        update(): void {
            const currentTime = game.runtime()
            this.elapsed = currentTime - this.timer
            this.timer = currentTime

            for(let tracker of this.trackers) {
                tracker.update(this.elapsed)
            }
        }
    }

    export class Tracker {
        private _elapsed: number
        private _period: number
        private _triggered: number

        constructor(period: number) {
            this._elapsed = 0
            this._period = period
            this._triggered = 0
        }

        set period(value: number) {
            this._period = value
            if(value <= 0) {
                this._elapsed = 0
            }
        }

        get period(): number {
            return this._period
        }
        
        get triggered(): number {
            return this._triggered
        }

        update(elapsed: number) {
            if(this._period > 0) {
                this._elapsed += elapsed
                this._triggered = Math.floor(this._elapsed / this._period)
                this._elapsed -= this._triggered * this._period
            } else {
                this._triggered = 0
            }
        }
    }

    export const clock = new Clock()
}

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

enum StickInput {
    Neutral,
    Forward,
    Back,
    Down,
    DownForward,
    DownBack,
    Up,
    UpForward,
    UpBack,
}

type Frame = {
    images: Image[]
    duration: number
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
    timeTracker: timer.Tracker

    flipped: boolean
    state: FighterState

    stickInput: StickInput
    punchInput: Boolean
    kickInput: Boolean


    constructor(data: FighterData, spawnOnLeft: boolean) {
        this.frameData = data.frameData

        this.currentFrame = 'idle'
        this.state = FighterState.Idle
        this.stickInput = StickInput.Neutral
        this.flipped = spawnOnLeft

        this.sprite = sprites.create(assets.image`pixel`, SpriteKind.Player)
        this.sprite.setFlag(SpriteFlag.StayInScreen, true)
        this.sprite.ay = 400
        animation.runImageAnimation(this.sprite, this.frame.images, 200, false)

        this.timeTracker = timer.clock.addTracker(this.frame.duration)

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

    isNeutral(): boolean {
        return this.state == FighterState.Idle || this.state == FighterState.Walk
    }

    update(): void {
        let nextState = this.state

        // parse state changes
        if(this.timeTracker.triggered > 0) {
            switch (this.state) {
                case FighterState.Punch:
                case FighterState.Kick:
                    nextState = FighterState.Idle
                    break
            }
        }

        switch (this.state) {
            case FighterState.Jump:
                if(this.sprite.y >= 100) {
                    this.sprite.vx = 0
                    this.sprite.vy = 0
                    nextState = FighterState.Idle
                }
                break
        }

        // parse input
        if(this.isNeutral()) {
            switch (this.stickInput) {
                case StickInput.Up:
                    if (this.state != FighterState.Jump) {
                        this.sprite.vy = -180
                        nextState = FighterState.Jump
                    }
                    break
                case StickInput.UpForward:
                    this.sprite.vx = this.flipped ? 50 : -50
                    this.sprite.vy = -180
                    nextState = FighterState.Jump
                    break
                case StickInput.UpBack:
                    this.sprite.vx = this.flipped ? -50 : 50
                    this.sprite.vy = -180
                    nextState = FighterState.Jump
                    break
                case StickInput.Forward:
                    this.sprite.vx = this.flipped ? 50 : -50
                    nextState = FighterState.Walk
                    break
                case StickInput.Back:
                    this.sprite.vx = this.flipped ? -50 : 50
                    nextState = FighterState.Walk
                    break
                case StickInput.Neutral:
                    if (this.state == FighterState.Walk) {
                        this.sprite.vx = 0
                        this.sprite.vy = 0
                        nextState = FighterState.Idle
                    }
                    break
            }
        }
        this.stickInput = StickInput.Neutral

        if(this.punchInput) {
            switch(nextState) {
                case FighterState.Idle:
                case FighterState.Walk:
                    this.sprite.vx = 0
                    this.sprite.vy = 0
                    nextState = FighterState.Punch
                    break
            }
        }
        this.punchInput = false

        if (this.kickInput) {
            switch (nextState) {
                case FighterState.Idle:
                case FighterState.Walk:
                    this.sprite.vx = 0
                    this.sprite.vy = 0
                    nextState = FighterState.Kick
                    break
            }
        }
        this.kickInput = false

        if(this.state != nextState) {
            switch(nextState) {
                case FighterState.Idle:
                    this.currentFrame = 'idle'
                    break
                case FighterState.Walk:
                    this.currentFrame = 'walk'
                    break
                case FighterState.Punch:
                    this.currentFrame = 'punch'
                    break
                case FighterState.Kick:
                    this.currentFrame = 'kick'
                    break                
                case FighterState.Jump:
                    this.currentFrame = 'jump'
                    break
            }
            this.timeTracker.period = this.frame.duration
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
            duration: 0,
            looping: false,
            flipped: false,
        },
        'walk': {
            images: assets.animation`lyndsay-walk`,
            duration: 0,
            looping: true,
            flipped: false,
        },
        'jump': {
            images: assets.animation`lyndsay-jump`,
            duration: 0,
            looping: false,
            flipped: false,
        },
        'punch': {
            images: assets.animation`lyndsay-punch`,
            duration: 300,
            looping: false,
            flipped: false,
        },
        'kick': {
            images: assets.animation`lyndsay-kick`,
            duration: 300,
            looping: false,
            flipped: false,
        },        
    }
}

const p2data: FighterData = {
    health: 100,
    frameData: {
        'idle': {
            images: assets.animation`lyndsay-idle`,
            duration: 0,
            looping: false,
            flipped: false,
        },
    }
}

const p1 = new Fighter(p1data, true)
const p2 = new Fighter(p2data, false)

game.onUpdate(() => {
    if(controller.left.isPressed()) {
        if(controller.up.isPressed()) {
            p1.stickInput = StickInput.UpBack
        } else if(controller.down.isPressed()) {
            p1.stickInput = StickInput.DownBack
        } else {
            p1.stickInput = StickInput.Back
        }
    } else if (controller.right.isPressed()) {
        if (controller.up.isPressed()) {
            p1.stickInput = StickInput.UpForward
        } else if (controller.down.isPressed()) {
            p1.stickInput = StickInput.DownForward
        } else {
            p1.stickInput = StickInput.Forward
        }
    } else if (controller.up.isPressed()) {
        p1.stickInput = StickInput.Up
    } else if (controller.down.isPressed()) {
        p1.stickInput = StickInput.Down
    }

    if(controller.A.isPressed()) {
        p1.punchInput = true
    }
    if(controller.B.isPressed()) {
        p1.kickInput = true
    }

    timer.clock.update()
    p1.update()
})