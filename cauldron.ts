namespace cauldron {
    export class FrameDebugger {
        buffer: Sprite
        bufferImage: Image
        rect: collisions.Rectangle

        constructor() {
            this.bufferImage = image.create(scene.screenWidth(), scene.screenHeight())
            this.buffer = sprites.create(this.bufferImage, SpriteKind.create())
            this.buffer.z = 1000
            this.rect = new collisions.Rectangle()
        }

        paint(source:frames.FrameControlledSprite, box: collisions.CollisionBox, color: number) {
            if(box) {
                box.compute(source, this.rect, source.sprite.scale)
                this.bufferImage.drawRect(source.sprite.x, source.sprite.y, 2, 2, 9)
                this.bufferImage.drawRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height, color)
            }
        }

        clear() {
            this.bufferImage.fill(0)
        }
    }
}