namespace collisions {
    export class Rectangle {
        x: number
        y: number
        width: number
        height: number

        get left(): number { return this.x }
        get right(): number { return this.x + this.width }
        get top(): number { return this.y }
        get bottom(): number { return this.y + this.height }

        constructor() {}
        
        reposition(x: number, y: number, width: number, height: number) {
            this.x = x - width / 2
            this.y = y - height / 2
            this.width = width
            this.height = height
        }

        collideWith(target: Rectangle): boolean {
            return (target.right >= this.left && target.left <= this.right && target.bottom >= this.top && target.top <= this.bottom)
        }
    }

    export class CollisionBox extends Rectangle {

        constructor(x: number, y: number, width: number, height: number) {
            super()
            this.x = x
            this.y = y
            this.width = width
            this.height = height

        }

        compute(source: frames.FrameControlledSprite, box:Rectangle, scale: number = 1.0) {
            box.reposition(
                source.sprite.x + (source.faceRight ? this.x : -this.x) * scale,
                source.sprite.y + this.y * scale,
                this.width * scale,
                this.height * scale,
            )
        }
    }
    
    export let box1: Rectangle = new Rectangle()
    export let box2: Rectangle = new Rectangle()
}
