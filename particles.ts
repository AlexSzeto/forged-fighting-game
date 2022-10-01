namespace sfx {
    
    class HitSparkFactory extends particles.ParticleFactory {
        protected fastRandom: Math.FastRandom

        constructor(
            private color: number
        ) {
            super()
            this.fastRandom = new Math.FastRandom()
        }

        createParticle(anchor: particles.ParticleAnchor) {
            const p: particles.Particle = super.createParticle(anchor);

            p._x = Fx8(anchor.x);
            p._y = Fx8(anchor.y);

            p.lifespan = this.fastRandom.randomRange(200, 400);

            const angle = Math.random() * Math.PI * 2
            const factor = Math.random()

            p.vx = Fx8(p.lifespan / 2 * Math.cos(angle) * factor)
            p.vy = Fx8(p.lifespan / 2 * Math.sin(angle) * factor)

            p.color = this.color

            return p;
        }

        drawParticle(p: particles.Particle, x: Fx8, y: Fx8) {
            const size:number =
                p.lifespan > 200 ? 0 :
                p.lifespan > 100 ? 1 : 2

                switch(size) {
                    case 0:
                        screen.drawRect(Fx.toInt(Fx.sub(x, Fx.oneFx8)), Fx.toInt(y), 4, 2, p.color);
                        screen.drawRect(Fx.toInt(x), Fx.toInt(Fx.sub(y, Fx.oneFx8)), 2, 4, p.color);
                        break;
                    case 1:
                        screen.drawRect(Fx.toInt(x), Fx.toInt(y), 2, 2, p.color);
                        break;
                    case 2:
                        screen.setPixel(Fx.toInt(x), Fx.toInt(y), p.color);
                }
                    

            p.vx = Fx.div(Fx.mul(p.vx, Fx8(90)), Fx8(100))
            p.vy = Fx.div(Fx.mul(p.vy, Fx8(90)), Fx8(100))
        }
    }

    export function startHitSpark(x: number, y: number, color: number): particles.ParticleSource[] {
        const sources: particles.ParticleSource[] = [];

        const factory = new HitSparkFactory(color);
        const src = new particles.ParticleSource({ x, y }, 200, factory)
        src.lifespan = 50//100
        src.z = 30
        sources.push(src);
        return sources;
    }

    export function startBlockSpark(x: number, y: number) {
        const spark = sprites.create(assets.image`pixel`, SpriteKind.Food)
        animation.runImageAnimation(spark, assets.animation`block-spark`, 75, false)
        spark.lifespan = 75 * 4
        spark.x = x + Math.randomRange(-1, 1)
        spark.y = y + Math.randomRange(-1, 1)
        spark.z = 30
    }
}
