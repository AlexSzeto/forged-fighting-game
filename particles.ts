namespace sfx {
    // function start() {
    //     class StarFactory extends particles.ParticleFactory {
    //         protected galois: Math.FastRandom;
    //         protected possibleColors: number[];
    //         images: Image[];

    //         constructor(possibleColors?: number[]) {
    //             super();
    //             this.galois = new Math.FastRandom();
    //             this.images = [
    //                 img`
    //                         1
    //                     `, img`
    //                         1 . 1
    //                         . 1 .
    //                         1 . 1
    //                     `, img`
    //                         . 1 .
    //                         1 1 1
    //                         . 1 .
    //                     `
    //             ];

    //             if (possibleColors && possibleColors.length)
    //                 this.possibleColors = possibleColors;
    //             else
    //                 this.possibleColors = [1];
    //         }

    //         createParticle(anchor: particles.ParticleAnchor) {
    //             const p = super.createParticle(anchor);

    //             p._x = Fx8(this.galois.randomRange(0, screen.width));
    //             p._y = Fx8(0);
    //             p.vy = Fx8(this.galois.randomRange(40, 60));

    //             // set lifespan based off velocity and screen height (plus a little to make sure it doesn't disappear early)
    //             p.lifespan = Fx.toInt(Fx.mul(Fx.div(Fx8(screen.height + 20), p.vy), Fx8(1000)));

    //             const length = this.possibleColors.length - 1;
    //             p.color = this.possibleColors[this.possibleColors.length - 1];
    //             for (let i = 0; i < length; ++i) {
    //                 if (this.galois.percentChance(50)) {
    //                     p.color = this.possibleColors[i];
    //                     break;
    //                 }
    //             }

    //             // images besides the first one are only used on occasion
    //             p.data = this.galois.percentChance(15) ? this.galois.randomRange(1, this.images.length - 1) : 0;

    //             return p;
    //         }

    //         drawParticle(p: particles.Particle, x: Fx8, y: Fx8) {
    //             // on occasion, twinkle from white to yellow
    //             const twinkleFlag = 0x8000;
    //             const rest = 0x7FFF;
    //             if (twinkleFlag && p.data) {
    //                 if (this.galois.percentChance(10)) {
    //                     p.color = 1;
    //                     p.data &= rest;
    //                 }
    //             } else if (p.color === 1 && this.galois.percentChance(1)) {
    //                 p.color = 5;
    //                 p.data |= twinkleFlag;
    //             }

    //             const selected = this.images[rest & p.data].clone();
    //             selected.replace(0x1, p.color);
    //             screen.drawImage(selected, Fx.toInt(x), Fx.toInt(y));
    //         }
    //     }

    //     const sources: particles.ParticleSource[] = [];
    //     const colors = [1];
    //     for (let i = 0; i < 4; i++)
    //         colors.push(randint(2, 0xE));

    //     const factory = new StarFactory(colors);
    //     const src = new particles.ParticleSource(makeSimpleAnchor(), 25, factory)
    //     sources.push(src);
    //     return sources;
    // }
    
    function makeSimpleAnchor(): particles.ParticleAnchor {
        return {
            x: screen.width >> 1,
            y: screen.height >> 1
        };
    }

    export class HitSparkFactory extends particles.ParticleFactory {
        protected fastRandom: Math.FastRandom
        images: Image[]

        constructor() {
            super()
            this.fastRandom = new Math.FastRandom()
            this.images = [
                img`
                            1 0 1
                            0 1 0
                            1 0 1
                        `
            ]
        }

        createParticle(anchor: particles.ParticleAnchor) {
            const p: particles.Particle = super.createParticle(anchor);

            p._x = Fx8(anchor.x);
            p._y = Fx8(anchor.y);

            p.vx = Fx8(this.fastRandom.randomRange(-60, 60));
            p.vy = Fx8(this.fastRandom.randomRange(-60, 60));

            // set lifespan based off velocity and screen height (plus a little to make sure it doesn't disappear early)
            p.lifespan = 500;

            p.color = 15;

            // images besides the first one are only used on occasion
            p.data = 0

            return p;
        }

        drawParticle(p: particles.Particle, x: Fx8, y: Fx8) {
            screen.drawRect(Fx.toInt(x), Fx.toInt(y), 2, 2, 1);
            screen.drawRect(Fx.toInt(Fx.sub(x, Fx8(1))), Fx.toInt(Fx.sub(y, Fx8(1))), 2, 2, 1);
            p.vx = Fx.div(Fx.mul(p.vx, Fx8(95)), Fx8(100))
            p.vy = Fx.div(Fx.mul(p.vy, Fx8(95)), Fx8(100))
        }
    }

    export function start(): particles.ParticleSource[] {
        const sources: particles.ParticleSource[] = [];

        const factory = new HitSparkFactory();
        const src = new particles.ParticleSource(makeSimpleAnchor(), 60, factory)
        src.lifespan = 300
        sources.push(src);
        return sources;
    }
}
