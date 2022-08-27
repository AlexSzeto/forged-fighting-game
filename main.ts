const p1 = new fighters.Fighter(LYNDSAY_DATA, new inputs.ControllerInput(), true)
const p2 = new fighters.Fighter(LYNDSAY_DATA, new ai.AIInput(), false)
p1.opponent = p2
p2.opponent = p1

const box1 = new collisions.Rectangle()
const box2 = new collisions.Rectangle()

game.onUpdate(() => {

    p1.processInput()
    p2.processInput()

    fighters.processBumps(p1, p2)

    for(const projectile of fighters.projectileList) {
        projectile.update()
    }
})