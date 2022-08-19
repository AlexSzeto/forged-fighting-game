const LYNDSAY_DATA: fighters.FighterData = {
    frameData: new frames.FrameData()
}

LYNDSAY_DATA.frameData.addFrameSet('idle', assets.animation`lyndsay-idle`, [
    {
        motion: true,
        loop: true,
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