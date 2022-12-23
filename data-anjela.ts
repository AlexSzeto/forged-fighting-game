// const ANJELA_FIGHTER = (): fighters.FighterData => {
//     const data: fighters.FighterData = {
//         frameData: new frames.FrameData(),
//         grabData: [
//             {
//                 frameSetId: 'punch',
//                 range: -8,
//                 stance: frames.Stance.Stand,
//                 opponentAirborne: false,
//             }
//         ],
//         specials: [
//         ]
//     }

//     data.frameData.addSet('idle', assets.animation`anjela-idle`, [
//         {
//             neutral: true,
//             duration: 250,
//         },
//         {
//             duration: 250,
//         },
//         {
//             duration: 250,
//         },
//         {
//             duration: 250,
//             nextFrame: 0,
//         }
//     ])

//     // data.frameData.addSet('punch', assets.animation`lyndsay-punch`, [
//     //     {
//     //         action: frames.Action.Attack,
//     //         hurtbox: new collisions.CollisionBox(-8, 0, 18, 30),
//     //         ox: 2,
//     //         oy: 1,
//     //         duration: 200,
//     //         vx: -20
//     //     },
//     //     {
//     //         duration: 100,
//     //         hitbox: new collisions.CollisionBox(4, -4, 20, 12),
//     //         color: 2,
//     //         vx: 80
//     //     },
//     //     {
//     //         duration: 100,
//     //         hitbox: new collisions.CollisionBox(8, -4, 24, 12),
//     //         vx: 40
//     //     },
//     //     {
//     //         duration: 100,
//     //         vx: 0
//     //     }
//     // ])

//     // data.frameData.addSet('kick', assets.animation`lyndsay-kick`, [
//     //     {
//     //         action: frames.Action.Attack,
//     //         hurtbox: new collisions.CollisionBox(-5, 0, 18, 31),
//     //         duration: 150,
//     //     },
//     //     {
//     //         duration: 50,
//     //         hitbox: new collisions.CollisionBox(8, 11, 14, 12),
//     //     },
//     //     {
//     //         duration: 150,
//     //     }
//     // ])

//     // data.frameData.addSet('crouch', assets.animation`lyndsay-crouch`, [
//     //     {
//     //         neutral: true,
//     //         stance: frames.Stance.Crouched,
//     //         hurtbox: new collisions.CollisionBox(0, 0, 18, 22),
//     //         oy: 9,
//     //         nextFrame: 0
//     //     }
//     // ])

//     // data.frameData.addSet('crouch-punch', assets.animation`lyndsay-crouch-punch`, [
//     //     {
//     //         stance: frames.Stance.Crouched,
//     //         action: frames.Action.Attack,
//     //         hurtbox: new collisions.CollisionBox(0, 8, 20, 23),
//     //         oy: -7,
//     //         duration: 150,
//     //     },
//     //     {
//     //         hurtbox: new collisions.CollisionBox(0, 4, 18, 31),
//     //         hitbox: new collisions.CollisionBox(8, -10, 12, 26),
//     //         color: 2,
//     //         vx: 10,
//     //         duration: 100,
//     //     },
//     //     {
//     //         duration: 200,
//     //     }
//     // ])

//     // data.frameData.addSet('crouch-kick', assets.animation`lyndsay-crouch-kick`, [
//     //     {
//     //         stance: frames.Stance.Crouched,
//     //         action: frames.Action.Attack,
//     //         hurtbox: new collisions.CollisionBox(-5, 0, 18, 22),
//     //         ox: 5,
//     //         oy: 10,
//     //         duration: 150,
//     //     },
//     //     {
//     //         hitbox: new collisions.CollisionBox(8, 8, 14, 8),
//     //         blockedHigh: false,
//     //         knockdown: true,
//     //         ox: 9,
//     //         duration: 100,
//     //     },
//     //     {
//     //         ox: 7,
//     //         duration: 200
//     //     }
//     // ])

//     // data.frameData.addSet('walk-forward', assets.animation`lyndsay-walk`, [
//     //     {
//     //         neutral: true,
//     //         hurtbox: new collisions.CollisionBox(-2, 0, 18, 31),
//     //         vx: 50,
//     //         oy: -1,
//     //     },
//     //     {
//     //     },
//     //     {
//     //     },
//     //     {
//     //         nextFrame: 0
//     //     }
//     // ])

//     // data.frameData.addSet('walk-back', assets.animation`lyndsay-walk`, [
//     //     {
//     //         neutral: true,
//     //         hurtbox: new collisions.CollisionBox(-2, 0, 18, 31),
//     //         vx: -50,
//     //         oy: -1,
//     //     },
//     //     {
//     //     },
//     //     {
//     //     },
//     //     {
//     //         nextFrame: 0
//     //     }
//     // ])

//     // data.frameData.addSet('jump-punch', assets.animation`lyndsay-jump-punch`, [
//     //     {
//     //         stance: frames.Stance.Airborne,
//     //         action: frames.Action.Attack,
//     //         hurtbox: new collisions.CollisionBox(-1, 0, 16, 30),
//     //         motion: false,
//     //         duration: 150,
//     //         ox: -3,
//     //     },
//     //     {
//     //         hitbox: new collisions.CollisionBox(0, 10, 26, 10),
//     //         color: 2,
//     //         blockedLow: false,
//     //         duration: 300,
//     //     },
//     //     {
//     //         duration: -1,

//     //     }
//     // ])

//     // data.frameData.addSet('jump-kick', assets.animation`lyndsay-jump-kick`, [
//     //     {
//     //         stance: frames.Stance.Airborne,
//     //         action: frames.Action.Attack,
//     //         motion: false,
//     //         duration: 100,
//     //     },
//     //     {

//     //         hitbox: new collisions.CollisionBox(15, 15, 10, 10),
//     //         blockedLow: false,
//     //         duration: 200,
//     //     },
//     //     {
//     //         duration: -1,

//     //     }
//     // ])

//     // data.frameData.addSet('jump-forward', assets.animation`lyndsay-jump`, [
//     //     {
//     //         neutral: true,
//     //         stance: frames.Stance.Airborne,
//     //         hurtbox: new collisions.CollisionBox(-1, 0, 16, 30),
//     //         duration: 50,
//     //         vx: 50,
//     //         vy: -160,
//     //         ox: -3
//     //     },
//     //     {
//     //         neutral: true,
//     //         duration: 100,
//     //     },
//     //     {
//     //         neutral: true,
//     //         duration: 100,
//     //         nextFrame: 1
//     //     }
//     // ])

//     // data.frameData.addSet('jump-up', assets.animation`lyndsay-jump`, [
//     //     {
//     //         neutral: true,
//     //         stance: frames.Stance.Airborne,
//     //         hurtbox: new collisions.CollisionBox(-1, 0, 16, 30),
//     //         duration: 50,
//     //         vy: -160,
//     //         ox: -3
//     //     },
//     //     {
//     //         neutral: true,
//     //         duration: 100,
//     //     },
//     //     {
//     //         neutral: true,
//     //         duration: 100,
//     //         nextFrame: 1
//     //     }
//     // ])

//     // data.frameData.addSet('jump-back', assets.animation`lyndsay-jump`, [
//     //     {
//     //         neutral: true,
//     //         stance: frames.Stance.Airborne,
//     //         hurtbox: new collisions.CollisionBox(-1, 0, 16, 30),
//     //         duration: 50,
//     //         vx: -50,
//     //         vy: -160,
//     //         ox: -3
//     //     },
//     //     {
//     //         neutral: true,
//     //         duration: 100,
//     //     },
//     //     {
//     //         neutral: true,
//     //         duration: 100,
//     //         nextFrame: 1
//     //     }
//     // ])

//     // data.frameData.addSet('stand-wound', assets.animation`lyndsay-stand-wound`, [
//     //     {
//     //         action: frames.Action.Pain,
//     //         vx: -30,
//     //         ox: -2,
//     //         oy: 1
//     //     },
//     //     {
//     //     }
//     // ])

//     // data.frameData.addSet('crouch-wound', assets.animation`lyndsay-crouch-wound`, [
//     //     {
//     //         stance: frames.Stance.Crouched,
//     //         action: frames.Action.Pain,
//     //         vx: -20,
//     //         ox: -3,
//     //         oy: 8
//     //     },
//     //     {
//     //     }
//     // ])

//     // data.frameData.addSet('jump-wound', assets.animation`lyndsay-jump-wound`, [
//     //     {
//     //         stance: frames.Stance.Airborne,
//     //         action: frames.Action.Pain,
//     //         duration: -1,
//     //         vx: -50,
//     //         vy: -90,
//     //         oy: -8,
//     //     },

//     // ])

//     // data.frameData.addSet('prone', assets.animation`lyndsay-prone`, [
//     //     {
//     //         action: frames.Action.Pain,
//     //         invincible: true,
//     //         oy: 9,
//     //         duration: 200,
//     //     },
//     //     {
//     //         invincible: true,
//     //         duration: 400,
//     //     }
//     // ])

//     // data.frameData.addSet('stand-block', assets.animation`lyndsay-stand-block`, [
//     //     {
//     //         neutral: true,
//     //         action: frames.Action.Block,
//     //         oy: -1,
//     //         duration: -1,
//     //     }
//     // ])

//     // data.frameData.addSet('stand-block-recover', assets.animation`lyndsay-stand-block`, [
//     //     {
//     //         action: frames.Action.Block,
//     //         imageIndex: 1,
//     //         vx: -16,
//     //         oy: -1,
//     //         duration: 300
//     //     }
//     // ])

//     // data.frameData.addSet('crouch-block', assets.animation`lyndsay-crouch-block`, [
//     //     {
//     //         neutral: true,
//     //         stance: frames.Stance.Crouched,
//     //         action: frames.Action.Block,
//     //         duration: -1,
//     //         oy: 6
//     //     }
//     // ])

//     // data.frameData.addSet('crouch-block-recover', assets.animation`lyndsay-crouch-block`, [
//     //     {
//     //         stance: frames.Stance.Crouched,
//     //         action: frames.Action.Block,
//     //         imageIndex: 1,
//     //         duration: 300,
//     //         vx: -12,
//     //         oy: 6
//     //     }
//     // ])

//     // data.frameData.addSet('grab', assets.animation`lyndsay-grab`, [
//     //     {
//     //         stance: frames.Stance.Stand,
//     //         action: frames.Action.Grab,
//     //     },
//     //     {
//     //         action: frames.Action.Grab,
//     //         duration: 200,
//     //     },
//     //     {
//     //         action: frames.Action.Throw,
//     //         duration: 150,
//     //     },
//     //     {
//     //         action: frames.Action.Throw,
//     //         duration: 250,
//     //     }
//     // ])

//     // data.frameData.addSet('choke', assets.animation`lyndsay-choke`, [
//     //     {
//     //         stance: frames.Stance.Stand,
//     //         action: frames.Action.Choke,
//     //         duration: -1,
//     //         invincible: true,
//     //     }
//     // ])

//     // data.frameData.addSet('special-fireball', assets.animation`lyndsay-fireball`, [
//     //     {
//     //         action: frames.Action.Special,
//     //         duration: 200,
//     //     },
//     //     {
//     //         duration: 150,
//     //         create: LYNDSAY_FIREBALL(),
//     //     },
//     //     {
//     //         duration: 150,
//     //     }
//     // ])

//     // data.frameData.addSet('special-tornado-far', assets.animation`lyndsay-fire-tornado`, [
//     //     {
//     //         action: frames.Action.Special,
//     //         oy: -7,
//     //         duration: 175,
//     //         imageIndex: 1,
//     //         invincible: true,
//     //     },
//     //     {
//     //         duration: 150,
//     //         imageIndex: 2
//     //     },
//     //     {
//     //         duration: 100,
//     //         imageIndex: 3,
//     //         create: LYNDSAY_TORNADO()
//     //     },
//     //     {
//     //         duration: 550,
//     //         imageIndex: 4,
//     //     },
//     // ])

//     // data.frameData.addSet('special-tornado-close', assets.animation`lyndsay-fire-tornado`, [
//     //     {
//     //         action: frames.Action.Special,
//     //         oy: -7,
//     //         duration: 100,
//     //         imageIndex: 1,
//     //         invincible: true,
//     //     },
//     //     {
//     //         duration: 100,
//     //         imageIndex: 2
//     //     },
//     //     {
//     //         duration: 100,
//     //         imageIndex: 3,
//     //         create: LYNDSAY_TORNADO2()
//     //     },
//     //     {
//     //         duration: 400,
//     //         imageIndex: 4,
//     //     },
//     // ])

//     return data
// }