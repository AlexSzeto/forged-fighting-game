// scene.setBackgroundImage(assets.image`forest2`)
scene.setBackgroundColor(Math.randomRange(1, 15))
const p1Input = new ai.DummyInput()
const p2Input = new ai.DummyInput()
const p1 = new fighters.Fighter(LYNDSAY_FIGHTER(), new inputs.ControllerInput(), true)
const p2 = new fighters.Fighter(LYNDSAY_FIGHTER(), p2Input, false)
// p1Input.fighter = p1
//p1Input.opponent = p2

p2Input.fighter = p2
p2Input.opponent = p1
p1.opponent = p2
p2.opponent = p1
const fighterList = [p1, p2]

const box1 = new collisions.Rectangle()
const box2 = new collisions.Rectangle()

game.onUpdate(() => {
    
    fighters.processHits(p1, p2)

    p1.processInput()
    p2.processInput()

    fighters.processBumps(p1, p2)

    for(const projectile of fighters.projectileList) {
        projectile.update()

        for(const target of fighters.projectileList) {
            projectile.processCancel(target)
        }
        for(const fighter of fighterList) {
            projectile.processHit(fighter)
        }
    }
})