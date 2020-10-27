namespace SpriteKind {
    export const Brick = SpriteKind.create()
    export const Checker = SpriteKind.create()
    export const BounceChecker = SpriteKind.create()
    export const VisualFloof = SpriteKind.create()
}
/**
 * brick breaking game TODO list
 * 
 * [x] aiming
 * 
 * [x] firing balls
 * 
 * [x] brick spawning
 * 
 * [x] BUG: ghost bricks
 * 
 * [x] bricks breaking
 * 
 * [x] bricks w/ numbers
 * 
 * [ ] salvo count
 * 
 * [ ] brick placement
 * 
 * [ ] bricks moving
 * 
 * [ ] integrate art
 * 
 * [ ] progression mechanics
 * 
 * bricks: 8x8, balls: 2x2
 * 
 * tallest brick: 24
 */
// 1. place brick randomly
// 
// 2. delete if overlapping
// 
// 3. sliding window to flip wall on
sprites.onDestroyed(SpriteKind.Brick, function (sprite) {
    sprites.readDataSprite(sprite, "txt").destroy()
})
function fireSalvo () {
    if (!(isFiring)) {
        if (numSalvos == 0) {
            info.setScore(round)
            game.over(false, effects.splatter)
        }
        numSalvos += -1
        updateBallInfo()
        timer.background(function () {
            isFiring = true
            for (let index = 0; index < ballsPerSalvo; index++) {
                ball = sprites.createProjectileFromSprite(img`
                    1 1 
                    1 1 
                    `, cannon, (cursor.x - cannon.x) * ballSpeed, (cursor.y - cannon.y) * ballSpeed)
                ball.setFlag(SpriteFlag.BounceOnWall, true)
                ball.setFlag(SpriteFlag.DestroyOnWall, false)
                pause(200)
            }
            isFiring = false
        })
    }
}
function toggleWallsForBrick (brick: Sprite, wallOn: boolean) {
    collisionChecker = sprites.create(img`
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        `, SpriteKind.Checker)
    for (let loc of tiles.getTilesByType(myTiles.transparency8)) {
        tiles.placeOnTile(collisionChecker, loc)
        if (brick.overlapsWith(collisionChecker)) {
            tiles.setWallAt(loc, wallOn)
        }
    }
    collisionChecker.destroy()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    fireSalvo()
})
function createBricks () {
    for (let index2 = 0; index2 <= brickMaxNum; index2++) {
        vis = brickVisuals[randint(0, brickVisuals.length - 1)]
        brick = sprites.create(vis, SpriteKind.Brick)
        tiles.placeOnRandomTile(brick, myTiles.transparency8)
        brick.left = tiles.locationXY(tiles.locationOfSprite(brick), tiles.XY.left)
        brick.right = Math.constrain(brick.right, 0, 112)
        brick.top = tiles.locationXY(tiles.locationOfSprite(brick), tiles.XY.top)
        brick.bottom = Math.constrain(brick.bottom, 0, 80)
        sprites.setDataNumber(brick, "hp", randint(brickMinHealth, brickMaxHealth))
        setBrickNum(brick)
        for (let value of sprites.allOfKind(SpriteKind.Brick)) {
            if (brick.overlapsWith(value)) {
                brick.destroy()
            }
        }
    }
    bricks = sprites.allOfKind(SpriteKind.Brick)
    for (let value2 of bricks) {
        toggleWallsForBrick(value2, true)
    }
}
sprites.onOverlap(SpriteKind.BounceChecker, SpriteKind.Brick, function (sprite, otherSprite) {
    sprite.setFlag(SpriteFlag.Invisible, false)
    animation.runImageAnimation(
    sprite,
    [img`
        . . . . . . . . 
        . . . . . . . . 
        . . . . . . . . 
        . . . . . . . . 
        . . . 8 . . . . 
        . . . . . . . . 
        . . . . . . . . 
        . . . . . . . . 
        `,img`
        . . . . . . . . 
        . . . . . . . . 
        . . . 8 8 . . . 
        . . 8 . . 8 . . 
        . . 8 . . 8 . . 
        . . . 8 8 . . . 
        . . . . . . . . 
        . . . . . . . . 
        `,img`
        . . . . . . . . 
        . . . 8 8 . . . 
        . . 8 . . 8 . . 
        . 8 . . . . 8 . 
        . 8 . . . . 8 . 
        . . 8 . . 8 . . 
        . . . 8 8 . . . 
        . . . . . . . . 
        `,img`
        . . . 8 8 . . . 
        . . 8 . . 8 . . 
        . 8 . . . . 8 . 
        8 . . . . . . 8 
        8 . . . . . . 8 
        . 8 . . . . 8 . 
        . . 8 . . 8 . . 
        . . . 8 8 . . . 
        `],
    50,
    false
    )
    sprite.setKind(SpriteKind.VisualFloof)
    sprites.changeDataNumberBy(otherSprite, "hp", -1)
    if (sprites.readDataNumber(otherSprite, "hp") == 0) {
        toggleWallsForBrick(otherSprite, false)
        otherSprite.destroy()
        updateBallInfo()
    } else {
        setBrickNum(otherSprite)
    }
})
function updateBallInfo () {
    if (!(hdrSalvo)) {
        hdrSalvo = textsprite.create("SALVOS", 0, 5)
        hdrSalvo.top = 2
        hdrSalvo.left = 114
    }
    if (!(countSalvo)) {
        countSalvo = textsprite.create("#")
        countSalvo.top = hdrSalvo.bottom + 2
        countSalvo.left = 114
    }
    if (!(hdrBalls)) {
        hdrBalls = textsprite.create("BALLS", 0, 5)
        hdrBalls.left = 114
        hdrBalls.top = countSalvo.bottom + 2
    }
    if (!(countBalls)) {
        countBalls = textsprite.create("#")
        countBalls.left = 114
        countBalls.top = hdrBalls.bottom + 2
    }
    countBalls.setText("" + ballsPerSalvo)
    countSalvo.setText("" + numSalvos)
}
function announceRound () {
    story.queueStoryPart(function () {
        roundTxt = textsprite.create("ROUND" + round, 0, 5)
        roundTxt.setOutline(2, 6)
        roundTxt.setMaxFontHeight(24)
        roundTxt.right = 0
        roundTxt.y = scene.screenHeight() / 2
        story.spriteMoveToLocation(roundTxt, scene.screenWidth() / 2, roundTxt.y, 200)
    })
    story.queueStoryPart(function () {
        pause(1000)
        roundTxt.vx = 200
        pause(500)
        roundTxt.destroy()
    })
}
function setBrickNum (brick: Sprite) {
    brickTxt = sprites.readDataSprite(brick, "txt")
    if (brickTxt) {
        brickTxt.destroy()
    }
    textSprite = textsprite.create("" + sprites.readDataNumber(brick, "hp"), 0, 1)
    textSprite.setOutline(1, 15)
    textSprite.x = brick.x
    textSprite.y = brick.y
    sprites.setDataSprite(brick, "txt", textSprite)
}
function nextRound () {
    round += 1
    announceRound()
    brickMaxNum += 1
    brickMinHealth += 1
    brickMaxHealth = Math.round(brickMaxHealth * 1.3)
    ballsPerSalvo += 1
    numSalvos = 5
    updateBallInfo()
    createBricks()
}
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    sprite.startEffect(effects.trail, 100)
    collisionChecker = sprites.create(img`
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        8 8 8 8 8 8 8 8 
        `, SpriteKind.BounceChecker)
    collisionChecker.lifespan = 250
    tiles.placeOnTile(collisionChecker, location)
    collisionChecker.setFlag(SpriteFlag.Invisible, true)
})
scene.onOverlapTile(SpriteKind.Projectile, myTiles.tile4, function (sprite, location) {
    sprite.destroy()
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Brick, function (sprite, otherSprite) {
	
})
let textSprite: TextSprite = null
let brickTxt: Sprite = null
let roundTxt: TextSprite = null
let countBalls: TextSprite = null
let hdrBalls: TextSprite = null
let countSalvo: TextSprite = null
let hdrSalvo: TextSprite = null
let bricks: Sprite[] = []
let brick: Sprite = null
let vis: Image = null
let collisionChecker: Sprite = null
let ball: Sprite = null
let isFiring = false
let round = 0
let brickMaxHealth = 0
let brickMinHealth = 0
let brickMaxNum = 0
let ballsPerSalvo = 0
let numSalvos = 0
let brickVisuals: Image[] = []
let ballSpeed = 0
let cursor: Sprite = null
let cannon: Sprite = null
cannon = sprites.create(img`
    a a a a a a 
    a a a a a a 
    a a a a a a 
    a a a a a a 
    a a a a a a 
    a a a a a a 
    `, SpriteKind.Player)
cursor = sprites.create(img`
    a a 
    a a 
    `, SpriteKind.Player)
let cursor2 = sprites.create(img`
    a a a 
    a a a 
    a a a 
    `, SpriteKind.Player)
let cursorAngle = 3.14159
cannon.setPosition(64, 110)
tiles.setSmallTilemap(tilemap`level`)
tiles.coverAllTiles(myTiles.tile5, myTiles.tile6)
scene.setBackgroundColor(15)
ballSpeed = 10
brickVisuals = [
img`
    . . . . . . 5 4 5 . . . . . . . 
    . . . . . . 4 5 5 . . . . . . . 
    . . . . . 5 5 5 4 5 . . . . . . 
    . . . . . 5 4 5 5 5 . . . . . . 
    . . . . . 4 5 5 5 5 . . . . . . 
    . . . . . 5 5 5 4 5 . . . . . . 
    . . . . . 5 4 5 5 5 . . . . . . 
    . . . . . 4 5 5 4 5 . . . . . . 
    . . . . . 5 5 5 5 4 . . . . . . 
    . . . . . 5 4 5 5 5 . . . . . . 
    . . . . . 4 5 5 4 5 . . . . . . 
    . . . . . 5 4 5 5 4 . . . . . . 
    . 7 7 7 7 e 5 5 e e 7 7 7 7 . . 
    . 7 7 6 7 7 4 e 4 e 7 7 6 6 . . 
    . . . . 6 6 7 7 7 7 6 6 . . . . 
    . . . . . 6 6 6 6 6 . . . . . . 
    `,
img`
    .8676.7667...77676.6668.
    886666.66666666666666668
    866666667666676666667668
    866666666768666668676668
    886676686668666666866688
    886667668666876668688888
    888868787668778758888888
    .8888887776876558888888.
    ......88777777758.......
    .........7777776........
    .........777575.........
    ........6677575.........
    .........677575.........
    .........777575.........
    .........777575.........
    ........77775755........
    `,
img`
    ..........77.7..........
    .e222222266777622222222.
    e22422222226662224222222
    e22222422222222222224242
    e22242222224224222222222
    e24222224222222242242242
    ee222242224222222222222e
    .eeeeeeee2222422eeeeeee.
    ........e2222222........
    ........e2242242........
    ........e2222222........
    ........e2424222........
    ........e2222222........
    ........ee22242e........
    .........ee222e.........
    ..........eeee..........
    `,
img`
    . . 6 6 7 7 7 6 6 7 7 6 6 7 . . 
    . 6 6 7 7 7 6 6 6 7 7 7 6 6 7 . 
    6 6 7 7 7 6 6 6 7 7 7 7 7 6 7 7 
    6 6 7 7 7 6 6 7 7 7 7 7 6 6 7 7 
    5 6 6 7 7 7 6 6 7 7 7 7 6 6 7 7 
    5 6 6 6 7 7 7 6 7 7 7 6 6 7 7 7 
    1 5 5 6 6 7 7 6 6 7 7 6 6 7 7 7 
    1 5 5 6 6 7 7 6 6 7 7 7 6 6 7 7 
    1 5 6 6 7 7 7 6 6 7 7 7 7 6 6 7 
    1 5 6 6 7 7 6 6 7 7 7 7 7 6 6 7 
    5 6 6 6 7 7 6 6 6 7 7 7 7 6 6 7 
    5 6 6 7 7 7 7 7 6 7 7 7 6 6 7 7 
    6 6 7 7 7 7 7 7 6 7 7 6 6 7 7 7 
    6 6 6 7 7 7 7 6 6 7 7 6 6 7 7 7 
    . 6 6 6 7 7 7 6 6 7 7 6 6 7 7 . 
    . . 6 6 7 7 7 6 6 7 7 7 6 6 . . 
    `,
img`
    . . 6 6 . 6 6 . 
    a a 8 6 6 a 3 1 
    a a 6 8 6 a a 3 
    a a a 3 8 6 a a 
    . 8 a a a 8 8 . 
    8 8 a a a a 3 1 
    8 a a 3 a a a 3 
    a a a a 8 a a a 
    8 a a a 8 8 8 8 
    8 8 8 8 a a 8 8 
    8 8 a 8 a 3 1 8 
    . 8 8 8 a a 3 8 
    8 a a 8 a a a a 
    8 8 a 8 8 8 8 a 
    8 8 8 8 8 8 8 8 
    . 8 8 8 8 8 8 . 
    `,
img`
    . . . . . 7 7 6 6 7 7 . . . . . 
    . . c c c c 6 6 6 6 c c c c . . 
    . c c c c c c c c c c c c c c . 
    c c b b b c c c c c c c b b b b 
    b b b b b b b b b b b b b b b b 
    d d d b b b b b b b b b d d d d 
    d d 1 d d b b b b b b d 1 1 d d 
    d 1 1 1 1 d d d d d d 1 1 1 1 d 
    d 1 d d 1 1 1 1 1 1 1 1 1 d d d 
    d 1 1 1 1 1 1 d d d d d 1 1 1 d 
    . d 1 d d d 1 1 1 1 1 1 1 1 1 d 
    . d d 1 1 1 d d d d 1 1 1 d d . 
    . . . d d 1 1 1 1 1 1 d d . . . 
    . . . . . d d d d d d . . . . . 
    . . . . . . . d d . . . . . . . 
    . . . . . . d . d . . . . . . . 
    `,
img`
    ....eee442eeee624444....
    ..4444eee2ee666664444...
    .4444666666ee22e66ee444.
    4444666ee42e2ee4466e4444
    2444666444ee444ee664ee44
    2266666444e44444e6644ee4
    266664444e444444e44644e2
    224e4444ee4444444e4444e4
    224e4444e4444444e4444ee4
    224e4444e4444444e4444e44
    222e4444e4444444e4444e42
    222e4442ee444444e424e422
    e22ee4422e44444e4424e222
    e222e44222e4444e422ee222
    .e22ee4222ee44ee222e222.
    ...22e42222e44e222ee22..
    `,
img`
    7 . . . 5 4 5 4 5 5 4 5 5 . . . 
    6 7 . 4 4 e 4 4 e 4 4 e 4 5 . . 
    . 6 6 7 4 4 e 4 4 e 4 4 e 4 4 . 
    7 7 6 6 4 4 e 4 4 e 4 4 e 4 e 4 
    . . 7 6 4 4 e 4 4 e 4 4 e 4 e 4 
    . 7 6 6 4 4 e 4 4 e 4 4 e 4 4 . 
    7 6 . e e e 4 4 e 4 4 e 4 e . . 
    6 . . . c e e c e e c e e . . . 
    `
]
numSalvos = 5
ballsPerSalvo = 2
brickMaxNum = 10
brickMinHealth = 1
brickMaxHealth = 3
round = 1
createBricks()
updateBallInfo()
announceRound()
game.onUpdate(function () {
    spriteutils.placeAngleFrom(
    cursor2,
    spriteutils.degreesToRadians(cursorAngle),
    10,
    cannon
    )
    spriteutils.placeAngleFrom(
    cursor,
    spriteutils.degreesToRadians(cursorAngle),
    20,
    cannon
    )
})
game.onUpdate(function () {
    if (!(isFiring)) {
        cursorAngle += controller.dx(100)
        cursorAngle = Math.constrain(cursorAngle, 190, 350)
    }
})
game.onUpdateInterval(500, function () {
    if (0 == sprites.allOfKind(SpriteKind.Brick).length && 0 == sprites.allOfKind(SpriteKind.Projectile).length) {
        nextRound()
    }
})
