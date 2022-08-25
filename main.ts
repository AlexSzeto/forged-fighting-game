const player = new fighters.Fighter(LYNDSAY_DATA, new inputs.ControllerInput(), true)

game.onUpdate(() => {
    player.update()

    for(const projectile of fighters.projectileList) {
        projectile.update()
    }
})