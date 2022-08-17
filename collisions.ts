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

    export class CollisionBox extends Rectangle {
        reposition(base: Sprite, flipped: boolean) {
            return new Rectangle(
                base.x + this.x * (flipped ? -1 : 1),
                base.y + this.y,
                this.width,
                this.height,
                flipped
            )
        }
    }
}
