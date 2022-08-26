const p1 = new fighters.Fighter(LYNDSAY_DATA, new inputs.ControllerInput(), true)
const p2 = new fighters.Fighter(LYNDSAY_DATA, new ai.AIInput(), false)
p1.opponent = p2
p2.opponent = p1

const box1 = new collisions.Rectangle()
const box2 = new collisions.Rectangle()

game.onUpdate(() => {

    p1.frameData.frame.hurtbox.compute(p1, box1, 1.3)
    p2.frameData.frame.hurtbox.compute(p2, box2, 1.3)

    if(box1.collideWith(box2)) {
        const overlap = ((box1.width + box2.width) / 2 - Math.abs(p1.sprite.x - p2.sprite.x)) / 2
        if(p1.sprite.x > p2.sprite.x) {
            p1.sprite.x += overlap
            p2.sprite.x -= overlap
        } else {
            p1.sprite.x -= overlap
            p2.sprite.x += overlap
        }
    }
    p1.update()
    p2.update()

    for(const projectile of fighters.projectileList) {
        projectile.update()
    }
})