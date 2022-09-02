const LYNDSAY_FIREBALL = new frames.FrameData()

LYNDSAY_FIREBALL.addFrameSet('animation', assets.animation`projectile-fireball`, [
    {
        vx: 100,
        ox: 15,
        duration: 150,
    },
    {
        ox: 15,
        duration: 150,
        nextFrame: 0,
    }
], true)

const LYNDSAY_DATA: fighters.FighterData = {
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

LYNDSAY_DATA.frameData.addFrameSet('idle', assets.animation`lyndsay-idle`, [
    {
        nextFrame: 0
    }
])

LYNDSAY_DATA.frameData.addFrameSet('punch', assets.animation`lyndsay-punch`, [
    {
        action: frames.Action.Attack,
        duration: 300,
    },
    {
        duration: 100,
        hitbox: new collisions.CollisionBox(15, 0, 10, 10),
        knockdown: true
    },
    {

    }
])

LYNDSAY_DATA.frameData.addFrameSet('kick', assets.animation`lyndsay-kick`, [
    {
        action: frames.Action.Attack,
    },
    {
        duration: 100,
        hitbox: new collisions.CollisionBox(15, 15, 10, 10)
    },
    {

    }
])

LYNDSAY_DATA.frameData.addFrameSet('crouch', assets.animation`lyndsay-crouch`, [
    {
        stance: frames.Stance.Crouched,

        nextFrame: 0
    }
])

LYNDSAY_DATA.frameData.addFrameSet('crouch-punch', assets.animation`lyndsay-crouch-punch`, [
    {
        stance: frames.Stance.Crouched,
        action: frames.Action.Attack,
        duration: 150,
    },
    {

        hitbox: new collisions.CollisionBox(15, 15, 10, 10),
        duration: 100,
    },
    {
        duration: 50,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('crouch-kick', assets.animation`lyndsay-crouch-kick`, [
    {
        stance: frames.Stance.Crouched,
        action: frames.Action.Attack,
    },
    {
        hitbox: new collisions.CollisionBox(15, 22, 10, 10),
        knockdown: true,
        duration: 100,
    },
    {

    }
])

LYNDSAY_DATA.frameData.addFrameSet('walk-forward', assets.animation`lyndsay-walk`, [
    {
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

LYNDSAY_DATA.frameData.addFrameSet('walk-back', assets.animation`lyndsay-walk`, [
    {
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

LYNDSAY_DATA.frameData.addFrameSet('jump-punch', assets.animation`lyndsay-jump-punch`, [
    {
        stance: frames.Stance.Airborne,
        action: frames.Action.Attack,
        motion: false,
    },
    {

        hitbox: new collisions.CollisionBox(15, 15, 10, 10)
    },
    {
        duration: -1,

    }
])

LYNDSAY_DATA.frameData.addFrameSet('jump-kick', assets.animation`lyndsay-jump-kick`, [
    {
        stance: frames.Stance.Airborne,
        action: frames.Action.Attack,
        motion: false,
    },
    {

        hitbox: new collisions.CollisionBox(15, 15, 10, 10),
        knockdown: true
    },
    {
        duration: -1,

    }
])

LYNDSAY_DATA.frameData.addFrameSet('jump-forward', assets.animation`lyndsay-jump`, [
    {
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

LYNDSAY_DATA.frameData.addFrameSet('jump-up', assets.animation`lyndsay-jump`, [
    {
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

LYNDSAY_DATA.frameData.addFrameSet('jump-back', assets.animation`lyndsay-jump`, [
    {
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

LYNDSAY_DATA.frameData.addFrameSet('stand-wound', assets.animation`lyndsay-stand-wound`, [
    {
        action: frames.Action.Pain,        
    }, { vx: -30 }
])

LYNDSAY_DATA.frameData.addFrameSet('crouch-wound', assets.animation`lyndsay-crouch-wound`, [
    {
        stance: frames.Stance.Crouched,
        action: frames.Action.Pain,
    },
    {
        vx: -30
    }
])

LYNDSAY_DATA.frameData.addFrameSet('jump-wound', assets.animation`lyndsay-jump-wound`, [
    { 
        stance: frames.Stance.Airborne,
        action: frames.Action.Pain,
        duration: -1,
        vx: -50,
        vy: -50
    }
])

LYNDSAY_DATA.frameData.addFrameSet('prone', assets.animation`lyndsay-prone`, [
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

LYNDSAY_DATA.frameData.addFrameSet('stand-block', assets.animation`lyndsay-stand-block`, [
    {
        action: frames.Action.Block,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('stand-block-recover', assets.animation`lyndsay-stand-block`, [
    {
        action: frames.Action.Block,
        frameIndex: 1,
        vx: -10
    }
])

LYNDSAY_DATA.frameData.addFrameSet('crouch-block', assets.animation`lyndsay-crouch-block`, [
    {
        stance: frames.Stance.Crouched,
        action: frames.Action.Block,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('crouch-block-recover', assets.animation`lyndsay-crouch-block`, [
    {
        stance: frames.Stance.Crouched,
        action: frames.Action.Block,
        frameIndex: 1,
        vx: -10
    }
])

LYNDSAY_DATA.frameData.addFrameSet('special-fireball', assets.animation`lyndsay-fireball`, [
    {
        action: frames.Action.Special,
        duration: 200,
    },
    {
        duration: 300,
        create: LYNDSAY_FIREBALL,
    },
    {
        duration: 100,
    }
])