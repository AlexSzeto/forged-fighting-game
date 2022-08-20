const LYNDSAY_DATA: fighters.FighterData = {
    frameData: new frames.FrameData(),
    specials: [
        {
            frameSetKey: 'special-fireball',
            ground: true,
            air: false,
            motionInput: 'CB,F,P'
        }
    ]
}

LYNDSAY_DATA.frameData.addFrameSet('idle', assets.animation`lyndsay-idle`, [
    {
        loop: true,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('punch', assets.animation`lyndsay-punch`, [
    {        
        duration: 300
    }
])

LYNDSAY_DATA.frameData.addFrameSet('kick', assets.animation`lyndsay-kick`, [
    {
        duration: 300
    }
])

LYNDSAY_DATA.frameData.addFrameSet('crouch', assets.animation`lyndsay-crouch`, [
    {
        loop: true
    }
])

LYNDSAY_DATA.frameData.addFrameSet('crouch-punch', assets.animation`lyndsay-crouch-punch`, [
    {
        duration: 300,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('crouch-kick', assets.animation`lyndsay-crouch-kick`, [
    {
        duration: 300,
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
        loop: true,
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
        loop: true,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('jump-punch', assets.animation`lyndsay-jump-punch`, [
    {
        duration: 3000,
        motion: false,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('jump-kick', assets.animation`lyndsay-jump-kick`, [
    {
        duration: 3000,
        motion: false,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('jump-forward', assets.animation`lyndsay-jump`, [
    {
        duration: 100,
    },
    {
        duration: 100,
        vx: 50,
        vy: -180
    },
    {
        duration: 3000,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('jump-up', assets.animation`lyndsay-jump`, [
    {
        duration: 100,
    },
    {
        duration: 100,
        vy: -180
    },
    {
        duration: 3000,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('jump-back', assets.animation`lyndsay-jump`, [
    {
        duration: 100,
    },
    {
        duration: 100,
        vx: -50,
        vy: -180
    },
    {
        duration: 3000,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('special-fireball', assets.animation`lyndsay-fireball`, [
    {
        duration: 200,
    },
    {
        duration: 300,
    },
    {
        duration: 100,
    }
])