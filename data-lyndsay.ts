const LYNDSAY_DATA: fighters.FighterData = {
    frameData: new frames.FrameData()
}

LYNDSAY_DATA.frameData.addFrameSet('idle', assets.animation`lyndsay-idle`, [
    {
        duration: 200,
        loop: true,
        vx: 0,
        vy: 0
    }
])

LYNDSAY_DATA.frameData.addFrameSet('walk-forward', assets.animation`lyndsay-walk`, [
    {
        duration: 200,
        vx: 25,
    },
    {
        duration: 200,
        vx: 25,
    },
    {
        duration: 200,
        vx: 25,
    },
    {
        duration: 200,
        vx: 25,
        loop: true,
    }
])

LYNDSAY_DATA.frameData.addFrameSet('walk-back', assets.animation`lyndsay-walk`, [
    {
        duration: 200,
        vx: -25,
    },
    {
        duration: 200,
        vx: -25,
    },
    {
        duration: 200,
        vx: -25,
    },
    {
        duration: 200,
        vx: -25,
        loop: true,
    }
])