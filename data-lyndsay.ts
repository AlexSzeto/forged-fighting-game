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
    const data:fighters.FighterData = {
        frameData: new frames.FrameData(),
        grabData: [
            {
                frameSetId: 'punch',
                range: -8,
                stance: frames.Stance.Stand,
                opponentAirborne: false,
            }
        ],
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
            duration: 500,
            neutral: true
        },
        {
            duration: 500,
            nextFrame: 0,
        }
    ])

    data.frameData.addFrameSet('punch', assets.animation`lyndsay-punch2`, [
        {
            action: frames.Action.Attack,
            
            duration: 200,
            ox: 8,
        },
        {
            duration: 100,
            hitbox: new collisions.CollisionBox(8, 0, 16, 8),
            ox: 12,
        },
        {
            duration: 100,
            ox: 8,

        }
    ])

    data.frameData.addFrameSet('kick', assets.animation`lyndsay-kick2`, [
        {
            action: frames.Action.Attack,
            
            duration: 50,
            oy: -2
        },
        {
            duration: 50,
            oy: -2,
            hitbox: new collisions.CollisionBox(15, 15, 10, 10),
            blockedHigh: false
        },
        {
            oy: -2,
            duration: 150,
        }
    ])

    data.frameData.addFrameSet('crouch', assets.animation`lyndsay-crouch2`, [
        {
            neutral: true,
            stance: frames.Stance.Crouched,
            nextFrame: 0
        }
    ])

    data.frameData.addFrameSet('crouch-punch', assets.animation`lyndsay-crouch-punch0`, [
        {
            stance: frames.Stance.Crouched,
            action: frames.Action.Attack,
            
            duration: 150,
            frameIndex: 1,
            oy: -4,
        },
        {

            frameIndex: 2,
            hitbox: new collisions.CollisionBox(4, -10, 10, 10),
            blockedHigh: false,
            duration: 100,
            oy: -4,
        },
        {
            frameIndex: 3,
            duration: 200,
            oy: -4,
        }
    ])

    data.frameData.addFrameSet('crouch-kick', assets.animation`lyndsay-crouch-kick2`, [
        {
            stance: frames.Stance.Crouched,
            action: frames.Action.Attack,
            
            duration: 150,
        },
        {
            hitbox: new collisions.CollisionBox(15, 15, 10, 10),
            blockedHigh: false,
            knockdown: true,
            duration: 100,
        },
        {
            duration: 200
        }
    ])

    data.frameData.addFrameSet('walk-forward', assets.animation`lyndsay-walk2`, [
        {
            neutral: true,
            vx: 50,
            oy:-1,
        },
        {
            oy: -1,
        },
        {
            oy: -1,
        },
        {
            oy: -1,
            nextFrame: 0
        }
    ])

    data.frameData.addFrameSet('walk-back', assets.animation`lyndsay-walk2`, [
        {
            neutral: true,
            vx: -50,
            oy: -1,
        },
        {
            oy: -1,
        },
        {
            oy: -1,

        },
        {
            
            oy: -1,
            nextFrame: 0
        }
    ])

    data.frameData.addFrameSet('jump-punch', assets.animation`lyndsay-jump-punch2`, [
        {
            stance: frames.Stance.Airborne,
            action: frames.Action.Attack,
            motion: false,
            duration: 150,
            oy: 4
        },
        {
         
            hitbox: new collisions.CollisionBox(0, 10, 20, 10),
            blockedLow: false,
            duration: 150,
            oy: 8
        },
        {
        
            duration: -1,
            oy: 4

        }
    ])

    data.frameData.addFrameSet('jump-kick', assets.animation`lyndsay-jump-kick2`, [
        {
            stance: frames.Stance.Airborne,
            action: frames.Action.Attack,
            motion: false,
            duration: 100,
            frameIndex: 1,
        },
        {

            hitbox: new collisions.CollisionBox(15, 15, 10, 10),
            blockedLow: false,
            duration: 200,
            frameIndex: 2,
        },
        {
            duration: -1,
            frameIndex: 3,

        }
    ])

    data.frameData.addFrameSet('jump-forward', assets.animation`lyndsay-jump2`, [
        {
            neutral: true,
            stance: frames.Stance.Airborne,
            duration: 50,
            vx: 50,
            vy: -160
        },
        {
            neutral: true,
            duration: 100,
        },
        {
            neutral: true,
            duration: 100,
            nextFrame: 1
        }
    ])

    data.frameData.addFrameSet('jump-up', assets.animation`lyndsay-jump2`, [
        {
            neutral: true,
            stance: frames.Stance.Airborne,
            duration: 50,
            vy: -160
        },
        {
            neutral: true,
            duration: 100,
        },
        {
            neutral: true,
            duration: 100,
            nextFrame: 1
        }
    ])

    data.frameData.addFrameSet('jump-back', assets.animation`lyndsay-jump2`, [
        {
            neutral: true,
            stance: frames.Stance.Airborne,
            duration: 50,
            vx: -50,
            vy: -160
        },
        {
            neutral: true,
            duration: 100,
        },
        {
            neutral: true,
            duration: 100,
            nextFrame: 1
        }
    ])

    data.frameData.addFrameSet('stand-wound', assets.animation`lyndsay-stand-wound2`, [
        {
            action: frames.Action.Pain,
            vx: -30,
            frameIndex: 1,
            ox: -2,
        },
        {
            frameIndex: 2,

            ox: -2
        }
    ])

    data.frameData.addFrameSet('crouch-wound', assets.animation`lyndsay-crouch-wound2`, [
        {
            stance: frames.Stance.Crouched,
            action: frames.Action.Pain,
            frameIndex: 1,
            vx: -20,
            ox: -3,
        },
        {
            frameIndex: 2,
           
            ox: -3
        }
    ])

    data.frameData.addFrameSet('jump-wound', assets.animation`lyndsay-jump-wound2`, [
        { 
            stance: frames.Stance.Airborne,
            action: frames.Action.Pain,
            duration: -1,
            vx: -50,
            vy: -90,
            oy: -8,
            frameIndex: 2,
        },

    ])

    data.frameData.addFrameSet('prone', assets.animation`lyndsay-prone2`, [
        {
            frameIndex: 1,
            action: frames.Action.Pain,
            invincible: true,
        }, 
        {
            frameIndex: 2,
            duration: 400,
            invincible: true,
        }
    ])

    data.frameData.addFrameSet('stand-block', assets.animation`lyndsay-stand-block2`, [
        {
            neutral: true,
            action: frames.Action.Block,
            frameIndex: 1,
            oy: -1,
            duration: 300,
        }
    ])

    data.frameData.addFrameSet('stand-block-recover', assets.animation`lyndsay-stand-block2`, [
        {
            action: frames.Action.Block,
            frameIndex: 2,
            vx: -16,
            oy: -1,
            duration: 300
        }
    ])

    data.frameData.addFrameSet('crouch-block', assets.animation`lyndsay-crouch-block2`, [
        {
            neutral: true,
            stance: frames.Stance.Crouched,
            action: frames.Action.Block,
            frameIndex: 1,
            duration: 300,

        }
    ])

    data.frameData.addFrameSet('crouch-block-recover', assets.animation`lyndsay-crouch-block2`, [
        {
            stance: frames.Stance.Crouched,
            action: frames.Action.Block,
            frameIndex: 2,
            vx: -12,
            duration: 300,
        }
    ])

    data.frameData.addFrameSet('grab', assets.animation`lyndsay-grab`, [
        {
            stance: frames.Stance.Stand,
            action: frames.Action.Grab,
            frameIndex: 1,
        },
        {
            action: frames.Action.Throw,
            frameIndex: 2,
        }
    ])

    data.frameData.addFrameSet('choke', assets.animation`lyndsay-choke`, [
        {
            stance: frames.Stance.Stand,
            action: frames.Action.Choke,
            frameIndex: 1,
            duration: -1,
            invincible: true,            
        }
    ])

    data.frameData.addFrameSet('special-fireball', assets.animation`lyndsay-fireball2`, [
        {
            action: frames.Action.Special,
            duration: 200,
        },
        {
            duration: 150,
            create: LYNDSAY_FIREBALL(),
        },
        {
            duration: 150,
        }
    ])

    return data
}