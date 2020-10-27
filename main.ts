namespace SpriteKind {
    export const Brick = SpriteKind.create()
    export const Checker = SpriteKind.create()
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
 * [ ] bricks breaking
 * 
 * [ ] brick placement
 * 
 * [ ] bricks w/ numbers
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
/**
 * 1. place brick randomly
 * 
 * 2. delete if overlapping
 * 
 * 3. sliding window to flip wall on
 */
sprites.onOverlap(SpriteKind.Brick, SpriteKind.Brick, function (sprite, otherSprite) {
    sprite.destroy()
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    ball = sprites.createProjectileFromSprite(img`
        1 1 
        1 1 
        `, cannon, (cursor.x - cannon.x) * ballSpeed, (cursor.y - cannon.y) * ballSpeed)
    ball.setFlag(SpriteFlag.BounceOnWall, true)
    ball.setFlag(SpriteFlag.DestroyOnWall, false)
})
function updateBricks () {
    for (let index = 0; index <= 10; index++) {
        vis = brickVisuals[randint(0, brickVisuals.length - 1)]
        brick = sprites.create(vis, SpriteKind.Brick)
        tiles.placeOnRandomTile(brick, myTiles.transparency8)
        brick.left = tiles.locationXY(tiles.locationOfSprite(brick), tiles.XY.left)
        brick.right = Math.constrain(brick.right, 0, 128)
        brick.top = tiles.locationXY(tiles.locationOfSprite(brick), tiles.XY.top)
    }
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
    bricks = sprites.allOfKind(SpriteKind.Brick)
    for (let loc of tiles.getTilesByType(myTiles.transparency8)) {
        tiles.placeOnTile(collisionChecker, loc)
        for (let value of bricks) {
            if (value.overlapsWith(collisionChecker)) {
                tiles.setWallAt(loc, true)
            }
        }
    }
    collisionChecker.destroy()
}
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    sprite.startEffect(effects.trail, 100)
})
scene.onOverlapTile(SpriteKind.Projectile, myTiles.tile4, function (sprite, location) {
    sprite.destroy()
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Brick, function (sprite, otherSprite) {
	
})
let bricks: Sprite[] = []
let collisionChecker: Sprite = null
let brick: Sprite = null
let vis: Image = null
let ball: Sprite = null
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
let cursorAngle = 3.14159
cannon.setPosition(80, 110)
cursor.setPosition(80, 90)
tiles.setSmallTilemap(tiles.createTilemap(hex`14000f00010101010000000000000000000000000101010101010101000000000000000000000000010101010101010100000000000000000000000001010101010101010000000000000000000000000101010101010101000000000000000000000000010101010101010100000000000000000000000001010101010101010000000000000000000000000101010101010101000000000000000000000000010101010101010100000000000000000000000001010101010101010000000000000000000000000101010101010101020202020202020202020202010101010101010102020202020202020202020201010101010101010202020202020202020202020101010101010101020202020202020202020202010101010101010101010101010101010101010101010101`, img`
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    2 2 2 2 . . . . . . . . . . . . 2 2 2 2 
    . . . . . . . . . . . . . . . . . . . . 
    `, [myTiles.transparency8,myTiles.tile4,myTiles.tile5], TileScale.Eight))
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
updateBricks()
game.onUpdate(function () {
    cursorAngle += controller.dx(100)
    cursorAngle = Math.constrain(cursorAngle, 180, 360)
})
game.onUpdate(function () {
    spriteutils.placeAngleFrom(
    cursor,
    spriteutils.degreesToRadians(cursorAngle),
    20,
    cannon
    )
})
