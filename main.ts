scene.setBackgroundImage(assets.image`forest2`)
scene.setBackgroundColor(Math.randomRange(1, 15))
const p1Input = new ai.AIInput()
const p2Input = new ai.AIInput()
// const p2Input = new ai.DummyInput(inputs.StickState.Neutral)
const p1 = new fighters.Fighter(LYNDSAY_FIGHTER(), new inputs.ControllerInput(), true)
// const p1 = new fighters.Fighter(LYNDSAY_FIGHTER(), p1Input, true)
const p2 = new fighters.Fighter(LYNDSAY_FIGHTER(), p2Input, false)

p1Input.fighter = p1
p1Input.opponent = p2

p2Input.fighter = p2
p2Input.opponent = p1
p1.opponent = p2
p2.opponent = p1
const fighterList = [p1, p2]

const frameDebug = new cauldron.FrameDebugger()

game.onUpdate(() => {    

    p1.processBlocks()
    p2.processBlocks()

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

    if(false) {
        frameDebug.clear()
        frameDebug.paint(p1, p1.frameData.frame.hitbox, 2)
        frameDebug.paint(p1, p1.frameData.frame.hurtbox, 10)
        frameDebug.paint(p2, p2.frameData.frame.hitbox, 2)
        frameDebug.paint(p2, p2.frameData.frame.hurtbox, 10)
        for (const projectile of fighters.projectileList) {
            frameDebug.paint(projectile, projectile.frameData.frame.hitbox, 2)
        }
    }

})

controller.menu.onEvent(ControllerButtonEvent.Pressed, () => {
    frameDebug.buffer.flags = SpriteFlag.Invisible - frameDebug.buffer.flags
})