namespace SpriteKind {
    export const Recharge = SpriteKind.create()
}
scene.onOverlapTile(SpriteKind.Food, sprites.dungeon.collectibleInsignia, function (sprite, location) {
    sprite.destroy()
    jewelCount += -1
})
sprites.onOverlap(SpriteKind.Recharge, SpriteKind.Food, function (sprite, otherSprite) {
    killOverlap = randint(0, 1)
    if (killOverlap == 0) {
        sprite.destroy()
        batteryCount += -1
    } else if (killOverlap == 1) {
        otherSprite.destroy()
        jewelCount += -1
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (jewelCount == 0) {
        game.splash("Return to spawn.")
    } else {
        game.splash("Jewels Remaining:" + jewelCount, "" + letsGolines[randint(0, 2)])
    }
})
function startGame () {
    titleText1.destroy()
    titleText2.destroy()
    if (blockSettings.exists("highScore") && blockSettings.readNumber("highScore") > 0) {
        highScoreText.destroy()
    }
    letsGolines = ["Lets go!", "Keep going!", "You can do it!"]
    load()
    spawnPlayer()
    screensCleared = 0
    showScore = true
}
controller.combos.attachCombo("uuddlrlrba", function () {
    if (CHEATtime <= 0) {
        CHEATcount += 1
        if (CHEATcount == 1) {
            CHEAT = 1
            CHEATtime = randint(1, 3)
            game.splash("Cheat Mode active", "Next " + CHEATtime + " rounds are free!")
        } else if (CHEATcount == 2) {
            game.splash("Trying to cheat again?", "1 per game.")
            game.splash("Do this again", "and your game will be over.")
        } else {
            game.splash("Not too bright huh?", "I warned you!")
            info.setScore(0)
            game.over(false)
        }
    }
})
function cheatCheck () {
    if (CHEATtime > 0) {
        CHEATtime += -1
        game.splash("" + CHEATtime + " screen time left.")
    }
    if (CHEAT == 1 && CHEATtime == 0) {
        CHEAT = 0
    }
}
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.darkGroundCenter, function (sprite, location) {
    tiles.setTileAt(location, assets.tile`transparency16`)
    if (CHEAT == 0) {
        statusbar.value += -1
    }
})
statusbars.onZero(StatusBarKind.Health, function (status) {
    if (info.life() > 0) {
        statusbar.value = 20
        info.changeLifeBy(-1)
        music.beamUp.play()
    } else {
        if (info.score() > blockSettings.readNumber("highScore")) {
            blockSettings.writeNumber("highScore", info.score())
            game.setGameOverMessage(false, "HIGH SCORE")
            game.setGameOverPlayable(false, music.melodyPlayable(music.powerUp), false)
        } else {
            game.setGameOverMessage(false, "GAME OVER!")
            game.setGameOverPlayable(false, music.melodyPlayable(music.powerDown), false)
        }
        game.over(false)
    }
})
function playerRotation () {
    if (controller.right.isPressed()) {
        DrillBot.setImage(assets.image`Player - Right`)
    } else if (controller.left.isPressed()) {
        DrillBot.setImage(assets.image`Player - Left`)
    } else if (controller.up.isPressed()) {
        DrillBot.setImage(assets.image`Player - Up`)
    } else if (controller.down.isPressed()) {
        DrillBot.setImage(assets.image`Player - Down`)
    }
}
function load () {
    cheatCheck()
    tiles.setTilemap(tilemap`Map`)
    spawnBattery()
    spawnJewels()
}
info.onLifeZero(function () {
	
})
function spawnJewels () {
    jewelCount = randint(4 + screensCleared, 8 + screensCleared)
    for (let index = 0; index < jewelCount; index++) {
        item = randint(1, 2)
        if (item == 1) {
            Jewel1 = sprites.create(assets.image`jewel`, SpriteKind.Food)
            grid.snap(Jewel1)
            grid.place(Jewel1, tiles.getTileLocation(randint(0, 17), randint(0, 17)))
        } else if (item == 2) {
            Jewel2 = sprites.create(assets.image`jewel1`, SpriteKind.Food)
            grid.snap(Jewel2)
            grid.place(Jewel2, tiles.getTileLocation(randint(0, 17), randint(0, 17)))
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    jewelCount += -1
    otherSprite.destroy(effects.rings, 500)
    music.baDing.play()
})
scene.onOverlapTile(SpriteKind.Recharge, sprites.dungeon.collectibleInsignia, function (sprite, location) {
    sprite.destroy()
})
function spawnPlayer () {
    DrillBot = sprites.create(assets.image`Player - Right`, SpriteKind.Player)
    tiles.placeOnRandomTile(DrillBot, sprites.dungeon.collectibleInsignia)
    scene.cameraFollowSprite(DrillBot)
    grid.snap(DrillBot)
    grid.moveWithButtons(DrillBot)
    statusbar = statusbars.create(20, 6, StatusBarKind.Health)
    statusbar.max = 20
    statusbar.setLabel("POWER")
    statusbar.positionDirection(CollisionDirection.Bottom)
    statusbar.setBarBorder(1, 15)
    info.setLife(0)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Recharge, function (sprite, otherSprite) {
    batteryCount += -1
    difficaltyCheck()
    statusbar.value += batteryCharge
    if (statusbar.value >= statusbar.max) {
        if (info.life() < 9) {
            info.changeLifeBy(1)
            statusbar.value = 20
        }
    }
    otherSprite.destroy(effects.spray, 500)
    music.magicWand.play()
})
function difficaltyCheck () {
    if (difficultyLevel == 0) {
        batteryCharge = 10
    } else if (difficultyLevel == 1) {
        batteryCharge = 5
    } else if (difficultyLevel == 2) {
        batteryCharge = 3
    }
}
function spawnBattery () {
    if (CHEAT == 0) {
        batteryCount = randint(2, 11 - info.life())
        for (let index = 0; index < batteryCount; index++) {
            Battery = sprites.create(assets.image`myImage`, SpriteKind.Recharge)
            grid.snap(Battery)
            grid.place(Battery, tiles.getTileLocation(randint(0, 17), randint(0, 17)))
        }
    }
}
blockMenu.onMenuOptionSelected(function (option, index) {
    if (blockMenu.isMenuOpen()) {
        if (option == mainMenu[0]) {
            difficultyLevel = 1
            blockMenu.closeMenu()
            startGame()
        } else if (option == mainMenu[1]) {
            game.showLongText("Drill through the ground, find every jewel, and return to the starting point before your battery runs out.", DialogLayout.Full)
            game.showLongText("Find batteries to extend your drill time. And use the A button to check how many jewels are left.", DialogLayout.Full)
        } else if (option == mainMenu[2]) {
            if (game.ask("Confirm reset?")) {
                blockSettings.writeNumber("highScore", 0)
                game.reset()
            }
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.collectibleInsignia, function (sprite, location) {
    if (jewelCount < 1) {
        sprites.destroyAllSpritesOfKind(SpriteKind.Recharge)
        load()
        screensCleared += 1
    }
})
let Battery: Sprite = null
let difficultyLevel = 0
let batteryCharge = 0
let Jewel2: Sprite = null
let Jewel1: Sprite = null
let item = 0
let DrillBot: Sprite = null
let statusbar: StatusBarSprite = null
let CHEAT = 0
let CHEATcount = 0
let CHEATtime = 0
let showScore = false
let screensCleared = 0
let letsGolines: string[] = []
let batteryCount = 0
let killOverlap = 0
let jewelCount = 0
let mainMenu: string[] = []
let highScoreText: TextSprite = null
let titleText2: TextSprite = null
let titleText1: TextSprite = null
storyboard.loaderBootSequence.register()
storyboard.start("")
game.setDialogCursor(assets.image`myImage2`)
game.setDialogFrame(img`
    ..cccccccccccccccccccc..
    .ccaaaaaaaaaaaaaaaaaacc.
    ccaaa11111111111111aaacc
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    caaa1111111111111111aaac
    ccaaa11111111111111aaacc
    .ccaaaaaaaaaaaaaaaaaacc.
    ..cccccccccccccccccccc..
    `)
titleText1 = textsprite.create("Drill-Bot")
titleText1.setPosition(80, 25)
titleText2 = textsprite.create("By: supersmashgaming")
titleText2.setPosition(80, 45)
if (blockSettings.readNumber("highScore") > 1) {
    highScoreText = textsprite.create("High Score: " + blockSettings.readNumber("highScore") + " levels")
    highScoreText.setPosition(80, 4)
    highScoreText.setBorder(1, 10)
} else if (blockSettings.readNumber("highScore") > 0) {
    highScoreText = textsprite.create("High Score: " + blockSettings.readNumber("highScore") + " level")
    highScoreText.setPosition(80, 4)
    highScoreText.setBorder(1, 10)
}
mainMenu = ["Start Game", "How to play", "Reset High Score"]
blockMenu.showMenu(mainMenu, MenuStyle.List, MenuLocation.BottomHalf)
game.onUpdate(function () {
    if (blockMenu.isMenuOpen()) {
    	
    } else {
        playerRotation()
        if (showScore == true) {
            info.setScore(screensCleared)
        }
    }
})
