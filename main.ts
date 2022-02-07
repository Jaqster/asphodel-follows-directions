namespace SpriteKind {
    export const Cursor = SpriteKind.create()
    export const Collider = SpriteKind.create()
    export const Background = SpriteKind.create()
    export const TurningPlayer = SpriteKind.create()
    export const Intro = SpriteKind.create()
    export const SwitchCollider = SpriteKind.create()
}
/**
 * Asphodel needs your help!
 * 
 * Rearrange arrows to give directions
 */
function endWalking () {
    isWalking = false
    cursor.setFlag(SpriteFlag.Invisible, false)
    heldTile.setFlag(SpriteFlag.Invisible, false)
    scene.cameraFollowSprite(cursor)
    theWitch.setVelocity(0, 0)
    tiles.replaceAllTiles(assets.tile`tile12`, assets.tile`tile1`)
    tiles.replaceAllTiles(assets.tile`tile13`, assets.tile`tile2`)
    tiles.replaceAllTiles(assets.tile`tile14`, assets.tile`tile3`)
    tiles.replaceAllTiles(assets.tile`tile15`, assets.tile`tile4`)
    tiles.placeOnRandomTile(theWitch, assets.tile`tile11`)
    cursorLocation = tiles.locationOfSprite(theWitch)
    tiles.placeOnTile(cursor, cursorLocation)
    setAsphodelPaint(0)
    tiles.replaceAllTiles(assets.tile`tile35`, assets.tile`tile33`)
    tiles.replaceAllTiles(assets.tile`tile36`, assets.tile`tile32`)
    setWalls(assets.tile`tile33`, true)
    setActiveBlockColor(false)
}
function setWalls (tile: Image, on: boolean) {
    for (let value of tiles.getTilesByType(tile)) {
        tiles.setWallAt(value, on)
    }
}
sprites.onCreated(SpriteKind.Intro, function (sprite) {
    sprite.setFlag(SpriteFlag.RelativeToCamera, true)
    sprite.setFlag(SpriteFlag.Ghost, true)
    sprite.z = 99
})
function pressButton (button: Sprite) {
    button.image.replace(13, 2)
    pause(200)
    button.image.replace(2, 13)
    pause(200)
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (userCanInteract() && tiles.locationXY(cursorLocation, tiles.XY.row) > 0) {
        cursorLocation = tiles.locationInDirection(cursorLocation, CollisionDirection.Top)
        tiles.placeOnTile(cursor, cursorLocation)
    }
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    endWalking()
})
statusbars.onStatusReached(StatusBarKind.Magic, statusbars.StatusComparison.EQ, statusbars.ComparisonType.Percentage, 100, function (status) {
    skipIntro()
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile28`, function (sprite, location) {
    if (currentPaint != 2) {
        setAsphodelPaint(2)
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile4`, function (sprite, location) {
    story.queueStoryPart(function () {
        music.baDing.play()
        sprite.setKind(SpriteKind.TurningPlayer)
        tiles.setTileAt(location, assets.tile`tile15`)
        story.spriteMoveToTile(sprite, location, walkSpeed)
    })
    story.queueStoryPart(function () {
        sprite.vy = 0 - walkSpeed
        sprite.setKind(SpriteKind.Player)
    })
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (userCanInteract()) {
        music.stopAllSounds()
        startWalking()
    }
})
function getTileAtLocation () {
    if (tiles.tileIs(cursorLocation, assets.tile`tile1`)) {
        return assets.tile`tile1`
    } else if (tiles.tileIs(cursorLocation, assets.tile`tile4`)) {
        return assets.tile`tile4`
    } else if (tiles.tileIs(cursorLocation, assets.tile`tile2`)) {
        return assets.tile`tile2`
    } else {
        return assets.tile`tile3`
    }
}
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    clearStartScreen()
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (userCanInteract()) {
        if (holdingTile) {
            if (tiles.tileIs(cursorLocation, assets.tile`tile5`)) {
                tiles.setTileAt(cursorLocation, heldTile.image)
                cursor.image.replace(3, 10)
                holdingTile = false
                heldTile.setImage(img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `)
            }
        } else if (tiles.tileIs(cursorLocation, assets.tile`tile1`) || tiles.tileIs(cursorLocation, assets.tile`tile4`) || (tiles.tileIs(cursorLocation, assets.tile`tile2`) || tiles.tileIs(cursorLocation, assets.tile`tile3`))) {
            holdingTile = true
            heldTile.setImage(getTileAtLocation())
            tiles.setTileAt(cursorLocation, assets.tile`tile5`)
            cursor.image.replace(10, 3)
        }
    }
})
controller.anyButton.onEvent(ControllerButtonEvent.Released, function () {
    if (inIntro) {
        skipBar.value = 0
    }
})
function setAsphodelPaint (paint: number) {
    currentPaint = paint
    theWitch.setImage(asphodelImages[paint])
    setWalls(assets.tile`tile25`, true)
    setWalls(assets.tile`tile27`, true)
    setWalls(assets.tile`tile29`, true)
    if (paint == 1) {
        setWalls(assets.tile`tile25`, false)
    } else if (paint == 2) {
        setWalls(assets.tile`tile27`, false)
    } else if (paint == 3) {
        setWalls(assets.tile`tile29`, false)
    }
}
function clearStartScreen () {
    if (!(inIntro) && !(debug)) {
        introIndex += 1
        if (introIndex == 1) {
            controlIntro()
        } else {
            titleScreen.destroy()
        }
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (userCanInteract() && tiles.locationXY(cursorLocation, tiles.XY.column) > 0) {
        cursorLocation = tiles.locationInDirection(cursorLocation, CollisionDirection.Left)
        tiles.placeOnTile(cursor, cursorLocation)
    }
})
function startWalking () {
    isWalking = true
    theWitch.vy = 0 - walkSpeed
    cursor.setFlag(SpriteFlag.Invisible, true)
    heldTile.setFlag(SpriteFlag.Invisible, true)
    scene.cameraFollowSprite(theWitch)
    setAsphodelPaint(0)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile3`, function (sprite, location) {
    story.queueStoryPart(function () {
        music.baDing.play()
        sprite.setKind(SpriteKind.TurningPlayer)
        tiles.setTileAt(location, assets.tile`tile14`)
        story.spriteMoveToTile(sprite, location, walkSpeed)
    })
    story.queueStoryPart(function () {
        sprite.vy = walkSpeed
        sprite.setKind(SpriteKind.Player)
    })
})
function setActiveBlockColor (isPink: boolean) {
    if (isPink) {
        tiles.replaceAllTiles(assets.tile`tile38`, assets.tile`tile40`)
        tiles.replaceAllTiles(assets.tile`tile39`, assets.tile`tile37`)
        tiles.replaceAllTiles(assets.tile`tile42`, assets.tile`tile41`)
    } else {
        tiles.replaceAllTiles(assets.tile`tile37`, assets.tile`tile39`)
        tiles.replaceAllTiles(assets.tile`tile40`, assets.tile`tile38`)
        tiles.replaceAllTiles(assets.tile`tile41`, assets.tile`tile42`)
    }
    setWalls(assets.tile`tile37`, false)
    setWalls(assets.tile`tile38`, false)
    setWalls(assets.tile`tile39`, true)
    setWalls(assets.tile`tile40`, true)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile42`, function (sprite, location) {
    if (!(asphodelIsOnSwitch)) {
        tiles.placeOnTile(switchCollides, location)
        asphodelIsOnSwitch = true
        setActiveBlockColor(true)
        switchCooldownActive = true
        timer.after(1000, function () {
            switchCooldownActive = false
        })
    }
})
function showIntroDialog () {
    story.queueStoryPart(function () {
        buttonHider = sprites.create(img`
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccc
            `, SpriteKind.Intro)
        buttonHider.z = 98
        buttonHider.setFlag(SpriteFlag.RelativeToCamera, true)
        buttonHider.right = 160
        buttonHider.bottom = 120
        inIntro = true
        createIntroSprite(img`
            . . . . . . . . f . . . . . . . 
            . . . . . . . f c f . . . . . . 
            . . . . . . f c c f . . . . . . 
            . . . . . . f c c c f . . . . . 
            . . . . . f c c c c c f . . . . 
            . . . f f f c c c c c f f f . . 
            . . f c f c c c c c c c f c f . 
            . . f c c c c c c c c c c c f . 
            . . . f f f f f f f f f f f . . 
            . . . . f 4 6 6 6 6 6 4 f . . . 
            . . . . f 4 6 1 6 1 6 4 f . . . 
            . . . . f 4 6 6 6 6 6 4 f . . . 
            . . . . . f c c c c c f . . . . 
            . . . . . f a a a a a f . . . . 
            . . . . . f a f f f a f . . . . 
            . . . . . . f . . . f . . . . . 
            `, "Asphodel", 60)
        story.printDialog("Asphodel needs your help!", 80, 40, 50, 150, 13, 12, story.TextSpeed.Slow)
    })
    story.queueStoryPart(function () {
        story.printDialog("Use the arrow buttons to rearrange the directions on the path", 80, 40, 50, 150, 13, 12, story.TextSpeed.Slow)
        createIntroSprite(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . 4 4 . . . . . . . 
            . . . . . . a 1 4 4 . . . . . . 
            . . . . . 4 1 4 4 4 4 . . . . . 
            . . . . 4 4 4 4 4 4 4 4 . . . . 
            . . . 4 4 4 4 4 4 4 4 4 4 . . . 
            . . . 4 4 4 4 4 4 4 4 4 4 . . . 
            . . . . . 4 4 4 4 4 4 . . . . . 
            . . . . . 4 4 4 4 4 4 . . . . . 
            . . . . . 4 4 4 4 4 4 . . . . . 
            . . . . . 4 4 4 4 4 4 . . . . . 
            . . . . . 4 4 4 4 4 4 . . . . . 
            . . . . . 4 4 4 4 4 4 . . . . . 
            . . . . . 4 4 4 4 4 4 . . . . . 
            . . . . . . 4 4 4 4 . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, "Directions", 80)
    })
    story.queueStoryPart(function () {
        story.printDialog("Try to guide Asphodel to their goal!", 80, 40, 50, 150, 13, 12, story.TextSpeed.Slow)
        createIntroSprite(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . 4 4 4 4 4 . . . . . . 
            . . . . 4 e e e e e 4 . . . . . 
            . . . . 4 4 4 4 4 4 4 . . . . . 
            . . . 4 4 4 1 4 4 4 4 4 . . . . 
            . . 4 . 4 1 4 4 4 4 4 . 4 . . . 
            . . 4 . 4 4 f f 4 4 4 . 4 . . . 
            . . 4 . 4 4 4 f 4 4 4 . 4 . . . 
            . . 4 . 4 4 4 f 4 4 4 . 4 . . . 
            . . . 4 4 4 f f f 4 4 4 . . . . 
            . . . . 4 4 4 4 4 4 4 . . . . . 
            . . . . . . 4 4 4 . . . . . . . 
            . . . . . . 4 4 4 . . . . . . . 
            . . . . 4 4 4 4 4 4 4 . . . . . 
            . . . . . . . . . . . . . . . . 
            `, "Goal", 100)
    })
    story.queueStoryPart(function () {
        for (let value of sprites.allOfKind(SpriteKind.Intro)) {
            value.destroy()
        }
    })
}
function skipIntro () {
    if (inIntro) {
        story.clearQueuedStoryParts()
        for (let value of sprites.allOfKind(SpriteKind.Intro)) {
            value.destroy()
        }
        skipBar.destroy()
        inIntro = false
        titleScreen.destroy()
        startLevel()
    }
}
controller.anyButton.onEvent(ControllerButtonEvent.Repeated, function () {
    if (inIntro) {
        skipBar.value += 4
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile16`, function (sprite, location) {
    story.queueStoryPart(function () {
        theWitch.setFlag(SpriteFlag.Ghost, true)
        story.spriteMoveToTile(theWitch, location, walkSpeed)
    })
    story.queueStoryPart(function () {
        tiles.setTileAt(location, assets.tile`tile5`)
        victorydance = true
        music.stopAllSounds()
        pause(500)
        music.playMelody("C D C E D F E G ", tempo * 2)
        music.playMelody("E G F A G B A C5 ", tempo * 2)
        animation.runMovementAnimation(
        theWitch,
        "q 2 -2 4 0 m 0 0 q -4 -3 -8 0 m 0 0 q 2 -2 2 0 m 0 0 q 0 2 0 0",
        2000,
        false
        )
        music.playMelody("B C5 B - C5 B C5 - ", tempo * 2)
        music.playMelody("C5 - - B - - C5 - ", tempo * 2)
        projectile = sprites.createProjectileFromSprite(img`
            . 3 . 3 . 
            3 3 3 3 3 
            3 3 3 3 3 
            . 3 3 3 . 
            . . 3 . . 
            `, theWitch, 30, -55)
        projectile.setFlag(SpriteFlag.Ghost, true)
        projectile.x += 4
        projectile.y += -4
        projectile.ay = 200
        projectile.lifespan = 700
        pause(1000)
    })
    story.queueStoryPart(function () {
        victorydance = false
        theWitch.setFlag(SpriteFlag.Ghost, false)
        currentLevel += 1
        endWalking()
        startLevel()
    })
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile26`, function (sprite, location) {
    if (currentPaint != 1) {
        setAsphodelPaint(1)
    }
})
function createSkipStatusBar () {
    skipBar = statusbars.create(26, 6, StatusBarKind.Magic)
    skipBar.setBarBorder(1, 1)
    skipBar.value = 0
    skipBar.setLabel("HOLD A TO SKIP")
    skipBar.bottom = scene.screenHeight() - 0
    skipBar.right = scene.screenWidth() - 0
}
function controlIntro () {
    top = 35
    story.queueStoryPart(function () {
        inIntro = true
        titleScreen.setImage(img`
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbbbbdbbbbddbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbbbdbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbbbbbbbbddbbbbdbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbbbbddbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbbbbddbbbbbdbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
            `)
        introAsphodel = sprites.create(img`
            . . . . . . . . f . . . . . . . 
            . . . . . . . f c f . . . . . . 
            . . . . . . f c c f . . . . . . 
            . . . . . . f c c c f . . . . . 
            . . . . . f c c c c c f . . . . 
            . . . f f f c c c c c f f f . . 
            . . f c f c c c c c c c f c f . 
            . . f c c c c c c c c c c c f . 
            . . . f f f f f f f f f f f . . 
            . . . . f 4 6 6 6 6 6 4 f . . . 
            . . . . f 4 6 1 6 1 6 4 f . . . 
            . . . . f 4 6 6 6 6 6 4 f . . . 
            . . . . . f c c c c c f . . . . 
            . . . . . f a a a a a f . . . . 
            . . . . . f a f f f a f . . . . 
            . . . . . . f . . . f . . . . . 
            `, SpriteKind.Intro)
        introAsphodel.z += 4
        introAsphodel.setPosition(53, 95)
        introCursor = sprites.create(img`
            .aaaa............aaaa.
            aa1aaa..........aaa1aa
            a1aaa............aaa1a
            aaa................aaa
            aaa................aaa
            .a..................a.
            ......................
            ......................
            ......................
            ......................
            ......................
            ......................
            ......................
            ......................
            ......................
            ......................
            .a..................a.
            aaa................aaa
            aaa................aaa
            a1aaa............aaa1a
            aa1aaa..........aaa1aa
            .aaaa............aaaa.
            `, SpriteKind.Intro)
        introCursor.z += 5
        introCursor.setPosition(85, 60)
        introLeft = sprites.create(img`
            . . . d d . . . 
            . . d d d . . . 
            . d d d d d d d 
            d d d d d d d d 
            d d d d d d d d 
            . d d d d d d d 
            . . d d d . . . 
            . . . d d . . . 
            `, SpriteKind.Intro)
        introLeft.setPosition(92, 100)
        introRight = sprites.create(img`
            . . . d d . . . 
            . . . d d d . . 
            d d d d d d d . 
            d d d d d d d d 
            d d d d d d d d 
            d d d d d d d . 
            . . . d d d . . 
            . . . d d . . . 
            `, SpriteKind.Intro)
        introRight.setPosition(108, 100)
        introDown = sprites.create(img`
            . . d d d d . . 
            . . d d d d . . 
            . . d d d d . . 
            d d d d d d d d 
            d d d d d d d d 
            . d d d d d d . 
            . . d d d d . . 
            . . . d d . . . 
            `, SpriteKind.Intro)
        introDown.setPosition(100, 108)
        introUp = sprites.create(img`
            . . . d d . . . 
            . . d d d d . . 
            . d d d d d d . 
            d d d d d d d d 
            d d d d d d d d 
            . . d d d d . . 
            . . d d d d . . 
            . . d d d d . . 
            `, SpriteKind.Intro)
        introUp.setPosition(100, 92)
        introA = sprites.create(img`
            . . d d d d . . 
            d d d f f d d d 
            d d f d d f d d 
            d d f f f f d d 
            d d f d d f d d 
            d d f d d f d d 
            d d d d d d d d 
            . . d d d d . . 
            `, SpriteKind.Intro)
        introA.setPosition(130, 95)
        introB = sprites.create(img`
            . . d d d d . . 
            d d d f f d d d 
            d d f d d f d d 
            d d f f f d d d 
            d d f d d f d d 
            d d f f f f d d 
            d d d d d d d d 
            . . d d d d . . 
            `, SpriteKind.Intro)
        introB.setPosition(122, 105)
        introGoal = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . 4 4 4 4 4 . . . . . . 
            . . . . 4 e e e e e 4 . . . . . 
            . . . . 4 4 4 4 4 4 4 . . . . . 
            . . . 4 4 4 1 4 4 4 4 4 . . . . 
            . . 4 . 4 1 4 4 4 4 4 . 4 . . . 
            . . 4 . 4 4 f f 4 4 4 . 4 . . . 
            . . 4 . 4 4 4 f 4 4 4 . 4 . . . 
            . . 4 . 4 4 4 f 4 4 4 . 4 . . . 
            . . . 4 4 4 f f f 4 4 4 . . . . 
            . . . . 4 4 4 4 4 4 4 . . . . . 
            . . . . . . 4 4 4 . . . . . . . 
            . . . . . . 4 4 4 . . . . . . . 
            . . . . 4 4 4 4 4 4 4 . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Intro)
        introGoal.setPosition(115, 60)
        introDirection = sprites.create(img`
            b b b b b b b b b b b b b b b b 
            b b b b b b b b b b b b b b b b 
            b b b b b b b b b b b b b b b b 
            b b b b b b b b b a a b b b b b 
            b b b b b b b b b a a a b b b b 
            b b a a a a a a a a a a a b b b 
            b a a 1 a a a a a a a a a a b b 
            b a 1 a a a a a a a a a a a a b 
            b a a a a a a a a a a a a a a b 
            b a a a a a a a a a a a a a b b 
            b b a a a a a a a a a a a b b b 
            b b b b b b b b b a a a b b b b 
            b b b b b b b b b a a b b b b b 
            b b b b b b b b b b b b b b b b 
            b b b b b b b b b b b b b b b b 
            b b b b b b b b b b b b b b b b 
            `, SpriteKind.Intro)
        introDirection.setPosition(85, 44)
        textSprite = textsprite.create("HOW TO PLAY", 0, 3)
        textSprite.setFlag(SpriteFlag.RelativeToCamera, true)
        textSprite.setFlag(SpriteFlag.Ghost, true)
        textSprite.z = 101
        textSprite.top = 2
        textSprite.x = 80
        textSprite.setKind(SpriteKind.Intro)
        createSkipStatusBar()
    })
    story.queueStoryPart(function () {
        story.printDialog("Press B to make Asphodel walk", 80, top, 50, 150, 13, 12, story.TextSpeed.Slow)
    })
    story.queueStoryPart(function () {
        pressButton(introB)
    })
    story.queueStoryPart(function () {
        introCursor.setFlag(SpriteFlag.Invisible, true)
        story.spriteMoveToLocation(introAsphodel, 53, 42, walkSpeed / 2)
    })
    story.queueStoryPart(function () {
        pause(1000)
        introAsphodel.setPosition(53, 95)
        introCursor.setFlag(SpriteFlag.Invisible, false)
        pause(500)
    })
    story.queueStoryPart(function () {
        story.printDialog("Move the cursor with the direction buttons", 80, top, 50, 150, 13, 12, story.TextSpeed.Slow)
    })
    story.queueStoryPart(function () {
        pressButton(introLeft)
        introCursor.x += -16
        pause(500)
        pressButton(introRight)
        introCursor.x += 16
        pause(500)
        pressButton(introUp)
        introCursor.y += -16
        pause(500)
    })
    story.queueStoryPart(function () {
        story.printDialog("Press A to pick up a direction", 80, top, 50, 150, 13, 12, story.TextSpeed.Slow)
    })
    story.queueStoryPart(function () {
        pressButton(introA)
        introCursor.image.replace(10, 3)
        pause(500)
        pressButton(introDown)
        introCursor.y += 16
        introDirection.y += 16
        pressButton(introLeft)
        introCursor.x += -16
        introDirection.x += -16
        pressButton(introLeft)
        introCursor.x += -16
        introDirection.x += -16
    })
    story.queueStoryPart(function () {
        story.printDialog("Press A again to put it down", 80, top, 50, 150, 13, 12, story.TextSpeed.Slow)
    })
    story.queueStoryPart(function () {
        pressButton(introA)
        introCursor.image.replace(3, 10)
    })
    story.queueStoryPart(function () {
        story.printDialog("Guide Asphodel to the goal!", 80, top, 50, 150, 13, 12, story.TextSpeed.Slow)
    })
    story.queueStoryPart(function () {
        pressButton(introB)
    })
    story.queueStoryPart(function () {
        introCursor.setFlag(SpriteFlag.Invisible, true)
        story.spriteMoveToLocation(introAsphodel, introCursor.x, introCursor.y, walkSpeed / 2)
    })
    story.queueStoryPart(function () {
        introDirection.image.replace(10, 12)
        story.spriteMoveToLocation(introAsphodel, introGoal.x, introGoal.y, walkSpeed / 2)
    })
    story.queueStoryPart(function () {
        introGoal.setFlag(SpriteFlag.Invisible, true)
        story.spriteMoveToLocation(introAsphodel, introGoal.x, introGoal.y, walkSpeed / 2)
    })
    story.queueStoryPart(function () {
        animation.runMovementAnimation(
        introAsphodel,
        "q 2 -2 4 0 m 0 0 q -4 -3 -8 0 m 0 0 q 2 -2 2 0 m 0 0 q 0 2 0 0",
        2000,
        false
        )
        pause(1850)
        projectile = sprites.createProjectileFromSprite(img`
            . 3 . 3 . 
            3 3 3 3 3 
            3 3 3 3 3 
            . 3 3 3 . 
            . . 3 . . 
            `, introAsphodel, 30, -55)
        projectile.setFlag(SpriteFlag.Ghost, true)
        projectile.setFlag(SpriteFlag.RelativeToCamera, true)
        projectile.z = 200
        projectile.x += 4
        projectile.y += -4
        projectile.ay = 200
        projectile.lifespan = 700
        pause(1000)
    })
    story.queueStoryPart(function () {
        for (let value of sprites.allOfKind(SpriteKind.Intro)) {
            value.destroy()
        }
        skipBar.destroy()
        inIntro = false
        titleScreen.destroy()
    })
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile1`, function (sprite, location) {
    story.queueStoryPart(function () {
        music.baDing.play()
        sprite.setKind(SpriteKind.TurningPlayer)
        tiles.setTileAt(location, assets.tile`tile12`)
        story.spriteMoveToTile(sprite, location, walkSpeed)
    })
    story.queueStoryPart(function () {
        sprite.vx = walkSpeed
        sprite.setKind(SpriteKind.Player)
    })
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (userCanInteract() && tiles.locationXY(cursorLocation, tiles.XY.column) < tiles.tilemapColumns() - 1) {
        cursorLocation = tiles.locationInDirection(cursorLocation, CollisionDirection.Right)
        tiles.placeOnTile(cursor, cursorLocation)
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile32`, function (sprite, location) {
    tiles.setTileAt(location, assets.tile`tile36`)
    setWalls(assets.tile`tile33`, false)
    tiles.replaceAllTiles(assets.tile`tile33`, assets.tile`tile35`)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile2`, function (sprite, location) {
    story.queueStoryPart(function () {
        music.baDing.play()
        sprite.setKind(SpriteKind.TurningPlayer)
        tiles.setTileAt(location, assets.tile`tile13`)
        story.spriteMoveToTile(sprite, location, walkSpeed)
    })
    story.queueStoryPart(function () {
        sprite.vx = 0 - walkSpeed
        sprite.setKind(SpriteKind.Player)
    })
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile30`, function (sprite, location) {
    if (currentPaint != 3) {
        setAsphodelPaint(3)
    }
})
function userCanInteract () {
    return !(isWalking) && !(inIntro)
}
function distance (sprite: Sprite, x: number, y: number) {
    return Math.sqrt((sprite.x - x) ** 2 + (sprite.y - y) ** 2)
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (userCanInteract() && tiles.locationXY(cursorLocation, tiles.XY.row) < tiles.tilemapRows() - 1) {
        cursorLocation = tiles.locationInDirection(cursorLocation, CollisionDirection.Bottom)
        tiles.placeOnTile(cursor, cursorLocation)
    }
})
function createIntroSprite (image2: Image, label: string, top: number) {
    introIcon = sprites.create(image2, SpriteKind.Intro)
    introIcon.setFlag(SpriteFlag.RelativeToCamera, true)
    introIcon.setFlag(SpriteFlag.Ghost, true)
    introIcon.top = top
    introIcon.z = 99
    introArrow = sprites.create(img`
        . . . . d d . . . . . . 
        . . . d d . . . . . . . 
        . . d d . . . . . . . . 
        . d d d d d d d d d d d 
        d d d d d d d d d d d d 
        . d d d d d d d d d d d 
        . . d d . . . . . . . . 
        . . . d d . . . . . . . 
        . . . . d d . . . . . . 
        `, SpriteKind.Intro)
    introArrow.setFlag(SpriteFlag.Ghost, true)
    introArrow.setFlag(SpriteFlag.RelativeToCamera, true)
    introArrow.x = 30
    introArrow.y = introIcon.y
    introIcon.right = introArrow.left - 2
    introArrow.z = 99
    introText = textsprite.create(label, 0, 13)
    introText.setMaxFontHeight(16)
    introText.setFlag(SpriteFlag.Ghost, true)
    introText.setFlag(SpriteFlag.RelativeToCamera, true)
    introText.y = introIcon.y
    introText.left = introArrow.right + 2
    introText.setKind(SpriteKind.Intro)
    introText.z = 99
}
function startLevel () {
    tickevent.post([tickevent.createKV("game", "asphodel"), tickevent.createKV("level", "" + currentLevel), tickevent.createKV("time", game.runtime())])
    if (currentLevel >= levels.length) {
        game.over(true)
    }
    tiles.loadMap(levels[currentLevel])
    tiles.placeOnRandomTile(cursor, assets.tile`tile11`)
    tiles.placeOnRandomTile(theWitch, assets.tile`tile11`)
    scene.cameraFollowSprite(cursor)
    cursorLocation = tiles.locationOfSprite(cursor)
    holdingTile = false
    tiles.coverAllTiles(assets.tile`tile11`, assets.tile`tile5`)
    allDirt = []
    for (let value of tiles.getTilesByType(assets.tile`tile5`)) {
        if (distance(theWitch, tiles.locationXY(value, tiles.XY.x), tiles.locationXY(value, tiles.XY.y)) < 80) {
            allDirt.push(value)
        }
    }
    for (let value of tiles.getTilesByType(assets.tile`tile1`)) {
        tiles.setTileAt(value, assets.tile`tile5`)
        tiles.setTileAt(allDirt.removeAt(randint(0, allDirt.length - 1)), assets.tile`tile1`)
    }
    for (let value of tiles.getTilesByType(assets.tile`tile2`)) {
        tiles.setTileAt(value, assets.tile`tile5`)
        tiles.setTileAt(allDirt.removeAt(randint(0, allDirt.length - 1)), assets.tile`tile2`)
    }
    for (let value of tiles.getTilesByType(assets.tile`tile3`)) {
        tiles.setTileAt(value, assets.tile`tile5`)
        tiles.setTileAt(allDirt.removeAt(randint(0, allDirt.length - 1)), assets.tile`tile3`)
    }
    for (let value of tiles.getTilesByType(assets.tile`tile4`)) {
        tiles.setTileAt(value, assets.tile`tile5`)
        tiles.setTileAt(allDirt.removeAt(randint(0, allDirt.length - 1)), assets.tile`tile4`)
    }
    setWalls(assets.tile`tile33`, true)
    setActiveBlockColor(false)
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile41`, function (sprite, location) {
    if (!(asphodelIsOnSwitch)) {
        tiles.placeOnTile(switchCollides, location)
        asphodelIsOnSwitch = true
        setActiveBlockColor(false)
        switchCooldownActive = true
        timer.after(1000, function () {
            switchCooldownActive = false
        })
    }
})
let allDirt: tiles.Location[] = []
let introText: TextSprite = null
let introArrow: Sprite = null
let introIcon: Sprite = null
let textSprite: TextSprite = null
let introDirection: Sprite = null
let introGoal: Sprite = null
let introB: Sprite = null
let introA: Sprite = null
let introUp: Sprite = null
let introDown: Sprite = null
let introRight: Sprite = null
let introLeft: Sprite = null
let introCursor: Sprite = null
let introAsphodel: Sprite = null
let top = 0
let projectile: Sprite = null
let victorydance = false
let buttonHider: Sprite = null
let switchCooldownActive = false
let asphodelIsOnSwitch = false
let skipBar: StatusBarSprite = null
let inIntro = false
let holdingTile = false
let currentPaint = 0
let cursorLocation: tiles.Location = null
let isWalking = false
let switchCollides: Sprite = null
let introIndex = 0
let tempo = 0
let walkSpeed = 0
let theWitch: Sprite = null
let heldTile: Sprite = null
let cursor: Sprite = null
let currentLevel = 0
let titleScreen: Sprite = null
let asphodelImages: Image[] = []
let levels: tiles.WorldMap[] = []
let debug = false
debug = true
levels = [
tiles.createMap(tilemap`level1`),
tiles.createMap(tilemap`level2`),
tiles.createMap(tilemap`level3`),
tiles.createMap(tilemap`level4`),
tiles.createMap(tilemap`level5`),
tiles.createMap(tilemap`level6`),
tiles.createMap(tilemap`level7`),
tiles.createMap(tilemap`level8`),
tiles.createMap(tilemap`level9`),
tiles.createMap(tilemap`level10`),
tiles.createMap(tilemap`level11`)
]
let titleScreens = [img`
    ccccccccccccccccaaaaaaaaaaaaaaaaacccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccaaaaaaaacccccccccccccccccccccccccccccccccccaaccccccccccccccc
    cccccccccccccccaaaaaaaaaaaaaaaaaaccccccccccccccccccaacccccccccccccccccccccccccccccccccccccccccccccccaaaaaaaaccccccccccccccccccccccccccccccccccaaaacccccccccccccc
    ccccccccccccccaaaaaaaaaaaaaaaaaaaccccccccccccccccccaaacccccccccccccccccaacccccccccccccccccccccccccccaaaaaaaacccccccccccccccccccccccccccccccccaaaaaaccccccccccccc
    ccccccccccccccaaaaaaaaaaaaaaaaaaaccccccccccccccccccaaaacccccccccccccccaaaacccccccccccccccccccccccaaaaaaaaaaaaaacccccccccccccccccccccccccccccaaaaaaaacccccccccccc
    cccccccccccccccaaaaaaaaaaaaaaaaaaccccccccaaaaaaaaaaaaaaacccccccccccccaaaaaaccccccccccccccccccccccaaaaaaaaaaaaaaccccccccccccccccccccccccccccaaaaaaaaaaccccccccccc
    ccccccccccccccccaaaaaaaaaaaaaaaaacccccccaaaaaaaaaaaaaaaaacccccccccccaaaaaaaaccccccccccccccccccccccaaaaaaaaaaaaccccccccccccccccccccccccccccaaaaaaaaaaaacccccccccc
    cccccccccccccccccaaaaaaaaaaaaaaaccccccccaaaaaaaaaaaaaaaaaacccccccccaaaaaaaaaaccccccccccccccccccccccaaaaaaaaaaccccccccccccccccccccccccccccaaaaaaaaaaaaaaccccccccc
    ccccccccccccccccccaaaaccccccccccccccccccaaaaaaaaaaaaaaaaaaacccccccaaaaaaaaaaaaccccccccccccccccccccccaaaaaaaaccccccccccccccccaacccccccccccaaaaaaaaaaaaaaccccccccc
    cccccccccccccccccccaaaccccccccccccccccccaaaaaaaaaaaaaaaaaaaccccccaaaaaaaaaaaaaaccccccccccccccccccccccaaaaaacccccccccccccccccaaacccccccccccccaaaaaaaacccccccccccc
    ccccccccccccccccccccaaccccccccccccccccccaaaaaaaaaaaaaaaaaacccccccaaaaaaaaaaaaaacccccccccccccccccccccccaaaaccccccccccccccccccaaaaccccccccccccaaaaaaaacccccccccccc
    ccccccccccccccccccccccccccccccccccccccccaaaaaaaaaaaaaaaaacccccccccccaaaaaaaacccccccccccccccccccccccccccaacccccccccaaaaaaaaaaaaaaacccccccccccaaaaaaaacccccccccccc
    cccccccccccccccccccccccccccccccccccccccccaaaaaaaaaaaaaaaccccccccccccaaaaaaaacccccccccccccccccccccccccccccccccccccaaaaaaaaaaaaaaaaaccccccccccaaaaaaaacccccccccccc
    cccccccccccccccccccccccccddccccccccccccccccccccccccaaaacccccccccccccaaaaadaacccccccccccccccccccccccccccccccccccccaaaaaadaaaaaaaaaaacccccccccaaaaaaaacccccccccccc
    ccccccaaaaaacccccccccccccddccccccccccccccccccccccccaaaccccccccccccccaaaaadaacccccccccccccccccccccccccccccccccccccaaaaaddaaaaaaaaaaaaccccccccadaaaaaacccccccccccc
    cccccaaaaaaaaccccccccccccddccccccccccccccccccccccccaacccccccccccccccaaaaaddaccccccccccccccaacccccccccccccccccccccaaaaaddaaaaaaaaaaaaccccccccaddaaaaacccccccccccc
    cccccaaaaaaaaccccccccccccddcccccccccccccccccccccccccccccccccccccccccaaaaaddacccccccccccccaaacccccccccccccccccccccaaaaaddaaaaaaaaaaacccccccccaddaaaaacccccccccccc
    cccccaaaaaaaaccccccccccccdddccccccccccccccccccccccccccccccccccccccccaaaaaddaccccccccccccaaaacccccccccccccccccccccaaaadddaaaaaaaaaaccccccccccaddaaaaacccccccccccc
    cccccaaaaaaaaccccccccccccdddccccccccccccccccccccccccccccccccccccccccaaaaaddacccccccccccaaaaaaaaaaaaaaaccccccccccccaaadddaaaaaaaaacccccccccccaddaaaaaccccccccccaa
    cccccaaaaaaaaccccccccccccdddccccccccccccccccccccccccccccccccccccccccaaaaaddaccccccccccaaaaaaaaaaaaaaaaaccccccccccccccdddccccaaaacccccccccccccddaaaaccccccccccaaa
    cccccaaaaaaaaccccccccccccdddcccccccccccccccccccccccccccccccccccccccccaaaaddccccccccccaaaaaaaaaaaaaaaaaaccccccccccccccdddccccaaaccccccccccccccddcccccccccccccaaaa
    cccccaaaaaaaaccccccccccccddddccccccccccccccccccccccccccccccccccccccccccccddcccccccccaaaaaaaaaaaaaaaaaaaccccccccccccccdddccccaacccccccccccccccddccccccccccccaaaaa
    cccccaaaaaaaaccccccccccccddddcccccccccccccccddddddcccccccccccccccccccccccddcccccccccaaaaaaaaaaaaaaaaaaaccccccccccccccdddcccccccccccccccccccccddcccccccccccaaaaaa
    cccccaaaaaaaaccccccccccccddddcccccccccccccdddccccddccccccccccccccccccccccddccccccccccaaaaaaaaaaaaaaaaaaccccccccccccccdddcccccccccccccccccccccddccccccccccaaaaaaa
    cccccaaaaaaaaccccccccccccddddcccccccccccccddccccccdccccccccccccccccccccccddcccccccccccaaaaaaaaaaaaaaaaaccccccccccccccdddcccccccccddddccccccccddcccccccccaaaaaaaa
    ccaaaaaaaaaaaaaacccccccccddddccccccccccccddcccccccccccccccccccddddcccccccddccccccccccccaaaaaaaaaaaaaaacccccccccccccccdddcccccccddddddddccccccddcccccccccaaaaaaaa
    ccaaaaaaaaaaaaaacccccccccddddcccccccccccddcccccccccccccccccddddddddccccccddcccccccccccccaaaacccccccccccccccccccccccccdddccccccdddddddddccccccddccccccccccaaaaaaa
    cccaaaaaaaaaaaacccccccccdddddccccccccccdddccccccccccccccccdddcccddddcccccddccccccccccccccaaacccccccccccccccccccccccccdddcccccdddcccdddddcccccddcccccccccccaaaaaa
    ccccaaaaaaaaaaccccccccccdddcddcccccccccdddccccccccccccccddddcccccdddcccccddcccccccccccccccaacdcdddddcccccccccccccccccdddccccdddccccccdddcccccddccccccccccccaaaaa
    cccccaaaaaaaacccccccccccdddcddcccccccccddddcccccccccccccddcccccccddddccccddcccccccccccccccccddddccddddcccccccccdddcccdddccccddcccccccdddcccccddcccccccccccccaaaa
    ccccccaaaaaaccccccccccccdddcddcccccccccddddcccccccccccccddcccccccddddccccddcccccdddcccccccccddcccccddddcccccccddddddcdddcccdddcccccccddccccccddccccccccccccccaaa
    cccccccaaaacccccccccccccdddccdcccccccccdddddddccccccccccddcccccccdddddccdddcccddddddcccccccdddcccccdddddcccccdddcccdddddcccddccccccccddccccccddcccccccccccccccaa
    ccccccccaaccccccccccccccdddccdccccccccccddddddddccccccccddcccccccdddddccdddccdddddddccccccdddcccccccddddcccccddcccccddddcccddcccccccddcccccccddccccccccccccccccc
    ccccccccccccccccccccccccdddccdccccccccccccddddddddccccccddcccccccdddddccdddcddddccddccccccdddcccccccdddddcccdddccccccdddcccddcccccccddcccccccddccccccccccccccccc
    ccccccccccccccccccccccccdddccddccccccdcccccddddddddcccccddcccccccddddcccdddddddcccdddccccdddccccccccdddddcccdddccccccdddcccddccccccddccccccccddccccccccccccccccc
    ccccccccccccccccccccccccddcccddccccdddcccccccdddddddccccddccccccdddddcccddddddccccdddccccdddcccccccccddddcccdddccccccdddcccdddccccddcccccccccddccccccccccccccccc
    ccccccccccccccccccccccccddcccddcccdddccccccccccdddddccccddccccccdddddcccdddddcccccdddccccdddcccccccccddddcccdddccccccdddcccdddcccddccccccccccddccccccccccccccccc
    ccccccccccccccccccccccccddccccdccddcccccccccccccdddddcccddccccccddddccccddddccccccdddccccdddcccccccccddddcccdddccccccdddcccdddddddcccccccccccddccccccccccccccccc
    cccccccccccccccccccccccdddccccddddcccccccccccccccddddcccddcccccddddcccccddddcccccccddcccddddcccccccccddddcccdddccccccdddcccddddddccccccccdcccddccccccccccccccccc
    cccccccccccccccccccccccddcccdddddccccccccccccccccddddcccddcccccddddcccccddddcccccccddcccddddcccccccccddddcccdddccccccdddcccdddddccccccccddcccddccccccccccccccccc
    cccccccccccccccccccccccdddddddddcccccccccccccccccddddcccddccccddddccccccdddccccccccddcccddddcccccccccdddccccdddccccccdddcccddddccccccccddccccddccccccccccccccccc
    ccccccccccccccccccccccdddddddcdddccccccccccccccccddddcccddcccdddddccccccdddccccccccddcccddddcccccccccdddccccdddccccccdddcccddddcccccccdddccccddccccccccccccccccc
    cccccccccccccccccccccddddddcccddddccccdccccccccccddddcccddcccdddccccccccdddccccccccddcccddddccccccccddddccccdddccccccdddcccddddcccccccddcccccddccccccccccccccccc
    cccccccccccccccccccddddddccccccdddccccdccccccccccddddcccddcddddcccccccccdddccccccccddccccdddccccccccdddcccccddddcccccdddccccddddccccddddcccccddccccccccccccccccc
    ccccccccccccccccddddddddcccccccdddccccddccccccccddddccccddddddccccccccccdddccccccccddccccddddccccccdddccccccddddcccccdddccccdddddddddddccccccdddcccccccccccccccc
    cccccccccccccdddddddddddcccccccddddcccdddddccccdddddccccdddddcccccccccccdddccccccccddcccccddddcccccdddccccccddddcccccddddccccdddddddddcccccccdddcccccccccccccccc
    ccccccccdddddddddcccdddcccccccccdddccccdddddddddddccccccddccccccccccccccdddccccccccdddccccdddddcccddccccccccdddddcccdddddcccccdddddddccccccccdddcccccccccccccccc
    cccccddddddddcccccccdddcccccccccdddccccccdddddddccccccccddccccccccccccccddddcccccccdddcccccddddddddccccccccccddddddddcdddccccccdddddcccccccccdddcccccccccccccccc
    cccccddddccccccccccddddcccccccccddddccccccccccccccccccccddccccccccccccccddddcccccccdddccccccddddddcccccccccccddddddddcdddccccccccccccccccccccddddccccccccccccccc
    ccccccccccccccccccddddccccccccccddddccccccccccccccccccccddccccccccccccccddddcccccccdddcccccccccccccccccccccccdddddddccdddccccccccccccccccccccddddccccccccccccccc
    ccccccccccccccccccddddcccccccccccddddcccccccccccccccccccdddcccccccccccccddddcccccccdddccccccccccccccccccccccccddddccccddddcccccccccccccccccccdddddcccccccccccccc
    cccccccccccccccccddddccccccccccccdddddccccccccccccccccccdddcccccccccccccddddcccccccdddccccccccccccccccccccccccccccccccddddcccccccccccccccccccddddddccccdcccccccc
    ccccccccccccccccdddddcccccccccccccdddddcccccccccccccccccdddcccccccccccccddddcccccccdddccccccccccccccccccccccccccccccccddddcccccccccccccccccccddddddddddddccccccc
    ccccccccccccccccdddddcccccccccccccdddddcccccccccccccccccdddcccccccccccccddddcccccccdddccccccccccccccccccccccccccccccccdddddcccccccccccccccccccddddddddddcccccccc
    cccccccccccccccdddddcccccccccccccccdddddccccccccccccccccdddcccccccccccccddddcccccccdddcccccccccccccccccccccccccccccccccccccccccccccccccccccccccdddddddddcccccccc
    cccccccccccccccddddccccccccccccccccddddddccccccccdccccccdddccccccccccccccccccccccccdddccccccccccccccccccccccccccccccccccccccccccccccccccccccccccddddddcccccccccc
    ccccccccccccccdddddcccccccccccccccccdddddddcccccdddcccccddddcccccccccccccccccccccccdddcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
    cccccccccccccdddddccccccccccccccccccdddddddddcccdddcccccddddcccccccccccccccccccccccddddccccccbbbbbcccccccccccccbbcccbbcccccccccccccccccccccccccccccccccccccccccc
    ccccccccccccddddddcccccccccccccccccccddddddddddddddcccccddddcccccccccccccccccccccccddddcccccbbbbbbbccccccccccccbbcccbbcccccccccccccccccccccccccccccccccccccccccc
    cccccccccccddddddcccccccccccccccccccccdddddddddddddcccccddddcccccccccccccccccccccccddddcccccbbccccbccccccccccccbbcccbbcccccccccccccccccccccccccccccccccccccccccc
    ccccccccccddddddcccccccccccccccccccccccddddddddddcccccccdddddccccccccccccccccccccccddddcccccbbccccbccccccccccccbbcccbbcccccccccccccccccccccccccccccccccccccccccc
    cccccccccdddddddccccccccccccccccccccccccdddddddcccccccccdddddccccccccccccccccccccccddddcccccbbcccccccccccccccccbbcccbbcccccccccccccccccccccccccccccccccccccccccc
    ccccccccdddddddcccccccccccc4dcccccccccccccccccccccccccccdddddccccccccccccccccccccccddddcccccbbcccccccccccccccccbbcccbbccccccccccccccccccccccccccccccccbbbccccccc
    cccccccdddddddccccccccccccc44cccccccccccccccccccccccccccdddddccccccccccccccccccccccdddddccccbbcccccccccbbbbccccbbcccbbccccccbbbbbccccbbccccccccbbcccbbbbbbcccccc
    cccccdddddddddcccccccccccccccc4cccccccc4ccccccccccccccccddddddcccccccccccccccccccccdddddccccbbccccccbbbbbbbbcccbbcccbbccccbbbbbbbbcccbbccccccccbbccbbbccbbcccccc
    cccccccddddddcccccccccccccccccccccccccccccccccccccccccccddddddcccccccccccccccccccccdddddccccbbcccccbbbcccbbbcccbbcccbbcccbbbbcccbbcccbbccccccccbbccbbccccccccccc
    cccccccccddddcccccccccccccccccccccccccccccccccccccccccccddddddcccccccccccccccccccccddddddcbbbbbbbccbbcccccbbbccbbcccbbccbbbbccccbbbccbbccccccccbbccbbccccccccccc
    ccccccccccccccccccccccccccccccccccccccccccccccccccccccccddddddccccccccccccccccccccccdddddcbbbbbbbcbbcccccccbbccbbcccbbccbbbccccccbbccbbccccccccbbccbbbcccccccccc
    ccccccccccccccccccc4cccccccccccccccd4cccccccccccccccccccccddddccccccccccccccccccccccdddddcccbbccccbbcccccccbbccbbcccbbccbbcccccccbbccbbccccccccbbcccbbbccccccccc
    ccccccccccccccccccccccccc4dcccccccc444ccccccccccccccccccccccccccccccccccccccccccccccddddccccbbccccbbcccccccbbccbbcccbbccbbcccccccbbccbbcccbbcccbbcccccbbbccccccc
    ccccccccccccccccccccccccc44cccccccc44dccccccccccccccccccccccccccccccccccccccccccccccccccccccbbccccbbcccccccbbccbbcccbbccbbcccccccbbccbbcccbbcccbbccccccbbbcccccc
    cccccccccccccccccccccccccccccccccccc44ccccccccccccccccccccccccccccccccccccccccccccccccccccccbbccccbbbccccccbbccbbcccbbccbbcccccccbbccbbccbbbbccbbccbccccbbcccccc
    cccccccccccccccccccccccccccccccccccccccc4cccccccccccccccccccccccccccccccccccccccccccccccccccbbccccbbbcccccbbbccbbcccbbccbbbcccccbbbccbbbbbbbbbbbbcbbccccbbcccccc
    ccccccccfffffffccccc4cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbcccccbbbcccbbbcccbbcccbbcccbbbbccbbbcccbbbbbccbbbbbcbbbcccbbcccccc
    cccccfffffccffffffccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbccccccbbbbbbbccccbbcccbbccccbbbbbbbbccccbbbbccbbbbcccbbccbbbcccccc
    ccccfffccfffffffffffcccc444ccccc4dccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbcccccccbbbbbcccccbbcccbbccccccbbbbcccccccbbccccbbccccbbbbbbccccccc
    cccfffccfffeee4fffffffcc4d44cccc44ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbcccccccccccccccccbbcccbbccccccccccccccccccccccccccccccbbbbcccccccc
    cccffffff444eed4eeffffff4444cccccccccccc4dccccccccccccccccccccccccccccccccccccccccccccccccccbbcccccccccccccccccbbcccbbcccccccccccccccccccccccccccccccccccccccccc
    cccfffffeee4ee44eeefffff4444ccccccccccc444ccccccccccccccccccccccccccccccccccccccccccccccccccbbcccccccccccccccccbbcbcbbcbcccccccccccccccccccccccccccccccccccccccc
    fffffffeeeeeeeeeeee444dffffccccccccccccc44ccccccccccccccccccccccccbbccccccccccccccccccccccccbbcccccccccccccccccbbbbcbbbbcccccccccccccccccccccccccccccccccccccccc
    fffffffeeeee44444de4ee44fffffccccc4dccccccccccccccccccccccccccccccbbccccccccccccccccccccccccccccccccccccccbbcccbbbccbbbccccccccccccccccccccccccccccccccccccccccc
    fffffffeee4eee4444eeeee4feefffcccc44ccccccccccccccccccccccccccccccbbccccccccccccccccccccccccccccccccccccccbbcccccccccccccccccccccccccccccccccccccccccccccccccccc
    ffffffffe4444ee444eeeeeeeeeeffffccccccccccccc4ccc4dcccccccccccccccbbccccccccccccccccccccccccccccccccccccccbbcccccccccccccccccccccccccccccccccccccccccccccccccccc
    ffffffffeeeedee4ee4444eeeeeee4dffcccccccccccccccc44cccccccccccccccbbccccccccccccccccccccccccccccccccccccccbbcccccccccccccccccccccccccccccccccccccccccccccccccccc
    fffffcfffeee4eeeeeeeed4eeeeeee4ffffcc4ccccccccccccccccccccccccccccbbccccccccccccccccccccccccccccccccccccccbbcccccccccccccccccccccccccccccccccccccccccccccccccccc
    ffffffcfffee4eeeeeeeee4ee44dee4fffffccccccccccccccccccccccccccccccbbcccccccccccccccccccccccccccccccccccbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccc
    ffffffccffeeeeee4eeeeeee44e44e4eefffffccccccccccccccccccccccccccccbbccbbcccccccccccccccccccccccccccccccbbbbbbbbccccccccccccccccccccccccccccccccccccccccccccccccc
    fffffffcfffeeeeeeeeeeeeeeeee4eeeee4dfffcccccccccccccccccccccccccccbbccbbccccccccccccccccccccccccccccccccccbbccccbbcccccccccccccccccccccccccccccccccccccccccccccc
    fffffffccfffeeeeee44dee44dee4eeee444ffffccc4ccccccccccccccccccccccbbccccccccccccccccccccccccccccccccccccccbbccccbbcccccccccccccccccccccccccccccccccccccccccccccc
    ffffffffccfffeeeeeee4ee444eeeeeeee44fffffcccccccccccccccccccccccccbbccccccbccccccccccccbbbbbbcccccbbbbccccbbcccccccccccccccccccccbccccccccccccbbbbcccccccccccccc
    ffffffffcccfff4444ee4ee444eeeeeeeefffffff4dcccccccccccccccccccccccbbccbbccbbcbbbbbccccbbbbbbbcccccbbbbbcccbbcccccccccccbbbbbbccccbbcbbbbcccccbbbbbbccccccccccccc
    fffffffffcccfffee44eeee44eee444eee444dfff44cccccccccccccccccbbbbbcbbccbbccbbbbbbbbbccbbbcccbbccccbbbccbcccbbccccbbccccbbbbbbbbcccbbbbcbbbcccbbbcccbccccccccccccc
    ffffffffffcccfffee4eeeeeeeeeee44eeeee44ffffccccccccccccccccbbbbbbbbbccbbccbbbbcccbbccbbccccbbcccbbbcccbcccbbccccbbcccbbbccccbbbccbbbcccbbbccbbccccbccccccccccccc
    fffffffffffcccffff44eeeeeeeeeee4eeeeee4efffcccccccccccccccbbbccbbbbbccbbccbbbccccbbccbbccccbbcccbbccccccccbbccccbbccbbbccccccbbccbbcccccbbccbbcccccccccccccccccc
    ffffffffffffcccffffeee444deeeee4eeeeee4effffcccccccccccccbbbccccbbbbccbbccbbccccccccbbbccccbcccbbcccccccccbbccccbbccbbcccccccbbccbbcccccbbccbbbccccccccccccccccc
    fffffffffffffccccffffeeee44eee4dee4eee4effffcccccccccccccbbccccccbbbccbbccbbccccccccbbbccbbbcccbbcccccccccbbccccbbccbbcccccccbbccbbcccccbbcccbbbcccccccccccccccc
    fffffffffffffffcccfffffeee4eeeeeee44eeeefffffccccccccccccbbccccccbbbccbbccbbccccccccbbbbbbbccccbbcccccccccbbccccbbccbbcccccccbbccbbcccccbbccccbbbbcccccccccccccc
    ffffffffffffffffcccfffffffeeeeee4eeedeeefffffccccccccccccbbccccccbbbccbbccbbccccccccbbbbcccccccbbcccccccccbbccccbbccbbcccccccbbccbbcccccbbccccccbbbccccccccccccc
    ffffffffffffffffffccffffffffeeeeeeee4eeefffffccccccccccccbbccccccbbbccbbccbbccccccccbbcccccccccbbccccccbccbbccccbbccbbcccccccbbccbbcccccbbcccccccbbbcccccccccccc
    fffffffffffffffffffccfffffffffffeeeeeeefffffcccccccccccccbbbccccbbbbccbbccbbccccccccbbccccccbccbbcccccbbccbbccccbbccbbccccccbbcccbbcccccbbccbccccbbbcccccccccccc
    ffffffffffffffffffffffccffffffffffffffffffffcccccccccccccbbbcccbbbbbccbbccbbccccccccbbbccccbbccbbbcccbbbccbbccccbbccbbbccccbbbcccbbcccccbbcbbccccbbbcccccccccccc
    ffffffffffffffffffffffffcffffffffffffffffffcccccccccccccccbbbbbbbbbbccbbccbbccccccccbbbbbbbbbcccbbbbbbbcccbbccccbbcccbbbbbbbbccccbbcccccbbcbbbccbbbbcccccccccccc
    ffffffffffffffffffffffffffcfffffffffffffffcccccccccccccccccbbbbbccbbccbbccbbcccccccccbbbbbbbcccccbbbbcccccbbccccbbccccbbbbbbcccccbbcccccbbccbbbbbbbccccccccccccc
    ffffffffffffffffffffffffffffffffffffffffffccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbcccccccccccccccccccccccccccccccccbbbbccccccccccccccc
    ffffffffffffffffffffffffffffffffffffffffffccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbcbcccccccccccccccccccccccccccccccccccccccccccccccccc
    ffffffffffffffffffffffffffffffffffffffffffccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbbbcccccccccccccccccccccccccccccccccccccccccccccccccc
    fffffffffffffffffffffffffffffffffffffffffffcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccbbbcccccccccccccccccccccccccccccccccccccccccccccccccca
    fffffffffffffffffffffffffffffffffffffffffffaaaaacccccccccccccccccccccccccccccccccccaacccccccccccccccccccccccccccccccccccccccccaaaaaaccccccccccccccccccccccccccaa
    ffffffffffffffffffffffffffffffffffffffffffffaaaaacccccccccccccccccccccccccccccccccaaaaccccccccccccccccaacccccccccccccccccccccaaaaaaaaccccccccccccccccccccccccaaa
    ffffffffffffffffffffffffffffffffffffffffffffaaaaaccccccccccccccccccccccccccccccccaaaaaaccccccccccccccaaacccccccccccccccccccccaaaaaaaaccccccccccccccccccccccccaaa
    ffffffffffffffffffffffffffffffffffffffffcfffaaaaacccccccccccccccccccccccccccccccaaaaaaaaccccccccccccaaaacccccccccccccccccccccaaaaaaaacccccccccccccccccccccccccaa
    ffffffffffffffffffffffffffffffffffffffffcfffaaaaaccccccccccccccccccccccccccccccaaaaaaaaaaccccccccccaaaaaaaaaaaaaaacccccccccccaaaaaaaacccccccccccccccccccccccccca
    ffffffffffffffffffffffffffffffffffffffffcfffaaaaacccccccccccccccccccccccccccccaaaaaaaaaaaaccccccccaaaaaaaaaaaaaaaaaccccccccccaaaaaaaaccccccccccccccccccccccccccc
    ffffffffffffffffffffffffffffffffffffffffcffaaaaaacccccccccccccaacccccccccccccaaaaaaaaaaaaaaccccccaaaaaaaaaaaaaaaaaaccccccccccaaaaaaaaccccccccccccccccccccccccccc
    fffffffffffffffffffffffffffffffffffffffccffaaaaaacccccccccccccaaaccccccccccccaaaaaaaaaaaaaacccccaaaaaaaaaaaaaaaaaaaccccccccccaaaaaaaaccccccccccccccccccccccccccc
    ffffffffffffffffffffffffffffffffffffffccfffaaaaaccccccccccccccaaaaccccccccccccccaaaaaaaaccccccccaaaaaaaaaaaaaaaaaaaccccccccccaaaaaaaaccccccccccccccccccaaccccccc
    ffffffffffffffffffffffffffffffffffffffccfffcccccccccccaaaaaaaaaaaaacccccccccccccaaaaaaaacccccccccaaaaaaaaaaaaaaaaaaccccccccccaaaaaaaaccccccccccccccccccaaacccccc
    fffffffffffffffffffffffffffffffffffffccffffccccccccccaaaaaaaaaaaaaaaccccccccccccaaaaaaaaccccccccccaaaaaaaaaaaaaaaaacccccccaaaaaaaaaaaaaaccccccaaaaaaaaaaaaaccccc
    ffffffffffffffffffffffffffffffffffffcccfffcccccccccccaaaaaaaaaaaaaaaacccccccccccaaaaaaaacccccccccccaaaaaaaaaaaaaaaccccccccaaaaaaaaaaaaaacccccaaaaaaaaaaaaaaacccc
    fffffffffffffffffffffffffffffffffffcccffffcccccccccccaaaaaaaaaaaaaaaaaccccccccccaaaaaaaaccccccccccccaaaacccccccccccccccccccaaaaaaaaaaaaccccccaaaaaaaaaaaaaaaaccc
    ffffffffffffffffffffffffffffffffffcccfffffcccccccccccaaaaaaaaaaaaaaaaaacccccccccaaaaaaaacccccccccccccaaaccccccccccccccccccccaaaaaaaaaacccccccaaaaaaaaaaaaaaaaacc
    `]
asphodelImages = [
img`
    . . . . . . . . f . . . . . . . 
    . . . . . . . f c f . . . . . . 
    . . . . . . f c c f . . . . . . 
    . . . . . . f c c c f . . . . . 
    . . . . . f c c c c c f . . . . 
    . . . f f f c c c c c f f f . . 
    . . f c f c c c c c c c f c f . 
    . . f c c c c c c c c c c c f . 
    . . . f f f f f f f f f f f . . 
    . . . . f 4 6 6 6 6 6 4 f . . . 
    . . . . f 4 6 1 6 1 6 4 f . . . 
    . . . . f 4 6 6 6 6 6 4 f . . . 
    . . . . . f c c c c c f . . . . 
    . . . . . f a a a a a f . . . . 
    . . . . . f a f f f a f . . . . 
    . . . . . . f . . . f . . . . . 
    `,
img`
    . . . . . . . . e . . . . . . . 
    . . . . . . . e 2 e . . . . . . 
    . . . . . . e 2 2 e . . . . . . 
    . . . . . . e 2 2 2 e . . . . . 
    . . . . . e 2 2 2 2 2 e . . . . 
    . . . e e e 2 2 2 2 2 e e e . . 
    . . e 2 e 2 2 2 2 2 2 2 e 2 e . 
    . . e 2 2 2 2 2 2 2 2 2 2 2 e . 
    . . . e e e e e e e e e e e . . 
    . . . . f 4 6 6 6 6 6 4 f . . . 
    . . . . f 4 6 1 6 1 6 4 f . . . 
    . . . . f 4 6 6 6 6 6 4 f . . . 
    . . . . . f c c c c c f . . . . 
    . . . . . f a a a a a f . . . . 
    . . . . . f a f f f a f . . . . 
    . . . . . . f . . . f . . . . . 
    `,
img`
    . . . . . . . . 8 . . . . . . . 
    . . . . . . . 8 6 8 . . . . . . 
    . . . . . . 8 6 6 8 . . . . . . 
    . . . . . . 8 6 6 6 8 . . . . . 
    . . . . . 8 6 6 6 6 6 8 . . . . 
    . . . 8 8 8 6 6 6 6 6 8 8 8 . . 
    . . 8 6 8 6 6 6 6 6 6 6 8 6 8 . 
    . . 8 6 6 6 6 6 6 6 6 6 6 6 8 . 
    . . . 8 8 8 8 8 8 8 8 8 8 8 . . 
    . . . . f 4 6 6 6 6 6 4 f . . . 
    . . . . f 4 6 1 6 1 6 4 f . . . 
    . . . . f 4 6 6 6 6 6 4 f . . . 
    . . . . . f c c c c c f . . . . 
    . . . . . f a a a a a f . . . . 
    . . . . . f a f f f a f . . . . 
    . . . . . . f . . . f . . . . . 
    `,
img`
    . . . . . . . . a . . . . . . . 
    . . . . . . . a 3 a . . . . . . 
    . . . . . . a 3 3 a . . . . . . 
    . . . . . . a 3 3 3 a . . . . . 
    . . . . . a 3 3 3 3 3 a . . . . 
    . . . a a a 3 3 3 3 3 a a a . . 
    . . a 3 a 3 3 3 3 3 3 3 a 3 a . 
    . . a 3 3 3 3 3 3 3 3 3 3 3 a . 
    . . . a a a a a a a a a a a . . 
    . . . . f 4 6 6 6 6 6 4 f . . . 
    . . . . f 4 6 1 6 1 6 4 f . . . 
    . . . . f 4 6 6 6 6 6 4 f . . . 
    . . . . . f c c c c c f . . . . 
    . . . . . f a a a a a f . . . . 
    . . . . . f a f f f a f . . . . 
    . . . . . . f . . . f . . . . . 
    `
]
titleScreen = sprites.create(titleScreens.removeAt(0), SpriteKind.Background)
titleScreen.setFlag(SpriteFlag.RelativeToCamera, true)
titleScreen.z = 10
currentLevel = 0
cursor = sprites.create(img`
    .aaaa............aaaa.
    aa1aaa..........aaa1aa
    a1aaa............aaa1a
    aaa................aaa
    aaa................aaa
    .a..................a.
    ......................
    ......................
    ......................
    ......................
    ......................
    ......................
    ......................
    ......................
    ......................
    ......................
    .a..................a.
    aaa................aaa
    aaa................aaa
    a1aaa............aaa1a
    aa1aaa..........aaa1aa
    .aaaa............aaaa.
    `, SpriteKind.Cursor)
cursor.setFlag(SpriteFlag.Ghost, true)
heldTile = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Food)
heldTile.setFlag(SpriteFlag.Ghost, true)
theWitch = sprites.create(img`
    . . . . . . . . f . . . . . . . 
    . . . . . . . f c f . . . . . . 
    . . . . . . f c c f . . . . . . 
    . . . . . . f c c c f . . . . . 
    . . . . . f c c c c c f . . . . 
    . . . f f f c c c c c f f f . . 
    . . f c f c c c c c c c f c f . 
    . . f c c c c c c c c c c c f . 
    . . . f f f f f f f f f f f . . 
    . . . . f 4 6 6 6 6 6 4 f . . . 
    . . . . f 4 6 1 6 1 6 4 f . . . 
    . . . . f 4 6 6 6 6 6 4 f . . . 
    . . . . . f c c c c c f . . . . 
    . . . . . f a a a a a f . . . . 
    . . . . . f a f f f a f . . . . 
    . . . . . . f . . . f . . . . . 
    `, SpriteKind.Player)
walkSpeed = 80
tempo = 240
introIndex = 0
startLevel()
music.setVolume(20)
if (debug) {
    titleScreen.destroy()
}
controller.configureRepeatEventDefaults(0, 30)
switchCollides = sprites.create(img`
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
    `, SpriteKind.SwitchCollider)
switchCollides.setFlag(SpriteFlag.Invisible, true)
pause(2000)
if (introIndex == 0) {
    clearStartScreen()
}
game.onUpdate(function () {
    tiles.placeOnTile(heldTile, cursorLocation)
})
game.onUpdate(function () {
    if (!(switchCooldownActive) && (asphodelIsOnSwitch && !(theWitch.overlapsWith(switchCollides)))) {
        asphodelIsOnSwitch = false
    }
})
