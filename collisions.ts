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

        collideWith(target: Rectangle): Rectangle {
            return (target.right >= this.left && target.left <= this.right && target.bottom >= this.top && target.top <= this.bottom) ?
                this.getCollisionBox(target) : null
        }

        getCollisionBox(target: Rectangle): Rectangle {
            const box = new Rectangle()
            box.x = this.left < target.left ? target.left : this.left
            box.width = this.right < target.right ? this.right - box.left : target.right - box.left
            box.y = this.top < target.top ? target.top : this.top
            box.height = this.bottom < target.bottom ? this.bottom - box.top : target.bottom - box.top
            return box
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
