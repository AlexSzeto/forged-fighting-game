const LYNDSAY_FIREBALL = (): frames.FrameData => {
    const data = new frames.FrameData()

    data.addFrameSet('active', assets.animation`projectile-fireball-active`, [
        {
            action: frames.Action.Attack,
            vx: 75,
            ox: 15,
            duration: 150,
        },
        {
            ox: 15,
            duration: 150,
            nextFrame: 0,
        }
    ], true)
    data.addFrameSet('death', assets.animation`projectile-fireball-death`, [
        {
            vx: 10,
            ox: 15,
            duration: 50,
        },
        {
            vx: 10,
            ox: 15,
            duration: 50,
        },
        {
            vx: 10,
            ox: 15,
            duration: 50,
        }
    ], true)

    return data
}

const LYNDSAY_FIGHTER = (): fighters.FighterData => {
    const data = {
        frameData: new frames.FrameData(),
        specials: [
            {
                frameSetKey: 'special-fireball',
                ground: true,
                air: false,
                motionInput: 'D,DF,F,P'
            }
        ]
    }

    data.frameData.addFrameSet('idle', assets.animation`lyndsay-idle`, [
        {
            nextFrame: 0,
            neutral: true
        }
    ])

    data.frameData.addFrameSet('punch', assets.animation`lyndsay-punch`, [
        {
            action: frames.Action.Attack,
            duration: 150,
        },
        {
            duration: 100,
            hitbox: new collisions.CollisionBox(15, 0, 10, 10),
        },
        {

        }
    ])

    data.frameData.addFrameSet('kick', assets.animation`lyndsay-kick`, [
        {
            action: frames.Action.Attack,
            duration: 200,
        },
        {
            duration: 50,
            hitbox: new collisions.CollisionBox(15, 15, 10, 10)
        },
        {
            duration: 50,
        }
    ])

    data.frameData.addFrameSet('crouch', assets.animation`lyndsay-crouch`, [
        {
            neutral: true,
            stance: frames.Stance.Crouched,

            nextFrame: 0
        }
    ])

    data.frameData.addFrameSet('crouch-punch', assets.animation`lyndsay-crouch-punch`, [
        {
            stance: frames.Stance.Crouched,
            action: frames.Action.Attack,
            duration: 150,
        },
        {

            hitbox: new collisions.CollisionBox(15, 15, 10, 10),
            blockedHigh: false,
            duration: 100,
        },
        {
            duration: 50,
        }
    ])

    data.frameData.addFrameSet('crouch-kick', assets.animation`lyndsay-crouch-kick`, [
        {
            stance: frames.Stance.Crouched,
            action: frames.Action.Attack,
        },
        {
            hitbox: new collisions.CollisionBox(15, 22, 10, 10),
            blockedHigh: false,
            knockdown: true,
            duration: 100,
        },
        {

        }
    ])

    data.frameData.addFrameSet('walk-forward', assets.animation`lyndsay-walk`, [
        {
            neutral: true,
            vx: 50,
        },
        {
        },
        {
        },
        {
            frameIndex: 1,
            nextFrame: 0
        }
    ])

    data.frameData.addFrameSet('walk-back', assets.animation`lyndsay-walk`, [
        {
            neutral: true,
            vx: -50,
        },
        {
        },
        {
        },
        {
            frameIndex: 1,
            nextFrame: 0
        }
    ])

    data.frameData.addFrameSet('jump-punch', assets.animation`lyndsay-jump-punch`, [
        {
            stance: frames.Stance.Airborne,
            action: frames.Action.Attack,
            motion: false,
            duration: 50,
        },
        {

            hitbox: new collisions.CollisionBox(15, 15, 10, 10),
            blockedLow: false,
            duration: 400
        },
        {
            duration: -1,

        }
    ])

    data.frameData.addFrameSet('jump-kick', assets.animation`lyndsay-jump-kick`, [
        {
            stance: frames.Stance.Airborne,
            action: frames.Action.Attack,
            motion: false,
            duration: 50,
        },
        {

            hitbox: new collisions.CollisionBox(15, 15, 10, 10),
            blockedLow: false,
            duration: 600,
        },
        {
            duration: -1,

        }
    ])

    data.frameData.addFrameSet('jump-forward', assets.animation`lyndsay-jump`, [
        {
            neutral: true,
            duration: 100,
        },
        {
            stance: frames.Stance.Airborne,
            duration: 100,
            vx: 50,
            vy: -220
        },
        {
            duration: -1,
        }
    ])

    data.frameData.addFrameSet('jump-up', assets.animation`lyndsay-jump`, [
        {
            neutral: true,
            duration: 100,
        },
        {
            stance: frames.Stance.Airborne,
            duration: 100,
            vy: -220
        },
        {
            duration: -1,
        }
    ])

    data.frameData.addFrameSet('jump-back', assets.animation`lyndsay-jump`, [
        {
            neutral: true,
            duration: 100,
        },
        {
            stance: frames.Stance.Airborne,
            duration: 100,
            vx: -50,
            vy: -220
        },
        {
            duration: -1,
        }
    ])

    data.frameData.addFrameSet('stand-wound', assets.animation`lyndsay-stand-wound`, [
        {
            action: frames.Action.Pain,
        },
        {
            vx: -30
        }
    ])

    data.frameData.addFrameSet('crouch-wound', assets.animation`lyndsay-crouch-wound`, [
        {
            stance: frames.Stance.Crouched,
            action: frames.Action.Pain,
        },
        {
            vx: -30
        }
    ])

    data.frameData.addFrameSet('jump-wound', assets.animation`lyndsay-jump-wound`, [
        { 
            stance: frames.Stance.Airborne,
            action: frames.Action.Pain,
            duration: -1,
            vx: -50,
            vy: -50
        }
    ])

    data.frameData.addFrameSet('prone', assets.animation`lyndsay-prone`, [
        {
            oy: 8,
            action: frames.Action.Pain,
            invincible: true
        }, 
        {
            oy: 8,
            duration: 400,
            invincible: true
        }
    ])

    data.frameData.addFrameSet('stand-block', assets.animation`lyndsay-stand-block`, [
        {
            neutral: true,
            action: frames.Action.Block,
            
        }
    ])

    data.frameData.addFrameSet('stand-block-recover', assets.animation`lyndsay-stand-block`, [
        {
            action: frames.Action.Block,
            frameIndex: 1,
            vx: -10
        }
    ])

    data.frameData.addFrameSet('crouch-block', assets.animation`lyndsay-crouch-block`, [
        {
            neutral: true,
            stance: frames.Stance.Crouched,
            action: frames.Action.Block,
        }
    ])

    data.frameData.addFrameSet('crouch-block-recover', assets.animation`lyndsay-crouch-block`, [
        {
            stance: frames.Stance.Crouched,
            action: frames.Action.Block,
            frameIndex: 1,
            vx: -10
        }
    ])

    data.frameData.addFrameSet('special-fireball', assets.animation`lyndsay-fireball`, [
        {
            action: frames.Action.Special,
            duration: 200,
        },
        {
            duration: 300,
            create: LYNDSAY_FIREBALL(),
        },
        {
            duration: 100,
        }
    ])

    return data
}