const player = document.querySelector('.player')
const playerStyle = document.querySelector('.player-style')
const solids = document.querySelectorAll('.solid')
const floor = document.querySelectorAll('.floor')
const game = document.querySelector('.game')
const ui = document.querySelector('.ui')
const effects = document.querySelector('.effects')
const uiText = document.querySelector('.text')
const light = document.querySelector('.light')
const cube = document.querySelector('.black-cube')

const maxAngle = 22

let angle = 0
const angleSpeed = 2
let tall = 100
let playerSpeed = 0
let maxSpeed = 10
let fallSpeed = 0
let positionX = 0
let positionY = 0
let cameraXCount = 1
let cameraYCount = 1
let effectsOpacity = 1
let physicsX = 0
let physicsY = 0
let turnLight = false
let lightX = true
let texting = false
let letterCount = 0
let lightBritness = 1.5
let lightBlur = 3

let contrast = 100
let sepia = 0
let brightness = 1
let blur = 0
let grayscale = 0
let saturate = 100

let tutorial = 0


let countClock = 0

let isJump = false
let onTheFloor = false
let isMovingRight = false
let isMovingLeft = false
let canInput = false

function start() {
    positionY = 400
    const startInterval = setInterval(() => {
        effects.style.backgroundColor = `rgba(0, 0, 0, ${effectsOpacity})`
        effectsOpacity -= 0.004
        if (effectsOpacity < -0.011) {
            effectsOpacity = 0
            canInput = true
            clearInterval(startInterval)
            setText(uiText, 100, 2000, 'hello')
        }
    }, 1000 / 60)
}


start()

function moveLight() {
    if (playerSpeed > 0) {
        lightX = true
        light.style.transform = `translateX(${positionX + 50}px) rotateY(0deg)`
    } else if (playerSpeed < 0) {
        lightX = false
        light.style.transform = `translateX(${positionX - 600}px) rotateY(180deg)`
    }
    if (countClock % 10 === 0) {
        lightBritness -= 0.5
        setTimeout(() => {
            lightBritness += 0.5
        }, Math.random() * 100)
    }
    console.log(lightBritness)
    light.style.marginTop = `${positionY - 25}px` 
    light.style.backdropFilter = `brightness(${lightBritness}) blur(${lightBlur}px)`
}

function moveEnemy() {
    cube.style.top = -positionY + 693 + 'px'
    cube.style.filter = `blur(${lightBlur}px)`
    cube.style.backgroundColor = `rgba(0, 0, 0, ${lightBritness - 1})`
    if (lightX) {
        cube.style.right = positionX - 8000 +'px'
    }
    else if (!lightX) {
        cube.style.right = -positionX + 8000 + 1200 + 'px'
    }
    
}

function setText(obj, delay, msgDelay, ...texts) {
    let promise = Promise.resolve()
    for (let k = 0; k < texts.length; k++) {
        promise = promise.then(() => {
            return new Promise(resolve => {
                setTimeout(() => {
                    obj.textContent = ''
                    obj.style.opacity = 1
                    let innerPromise = Promise.resolve()
                    for (let i = 0; i < texts[k].length; i++) {
                        innerPromise = innerPromise.then(() => {
                            return new Promise(innerResolve => {
                                setTimeout(() => {
                                    const letter = document.createElement('span')
                                    letter.textContent = texts[k][i]
                                    obj.appendChild(letter)
                                    texting = true
                                    innerResolve()
                                }, delay)
                            })
                        })
                    }
                    innerPromise.then(() => {
                        resolve()
                    })
                    
                }, msgDelay)
            })
        }).then(() => setTimeout(() => obj.style.opacity = 0, msgDelay))
    }
}

function triggers() {
    if (positionX >= 4300 && brightness > 0.3) { 
        const triggerInterval = setInterval(() => {
            brightness -= 0.001
            if (brightness <= 0.3) clearInterval(triggerInterval)
        }, 1000/60)
    } else if (positionX < 4300 && brightness < 1) {
        const triggerInterval = setInterval(() => {
            brightness += 0.001
            if (brightness >= 1) clearInterval(triggerInterval)
        }, 1000/60)
    }

    if (positionX >= 5500 && tutorial === 0) {
        document.querySelector('.light-click').style.opacity = 0.5
        setTimeout(() => document.querySelector('.light-click').style.opacity = 0, 5000)
        tutorial++
    }
}

function setEffects() {
    effects.style.backdropFilter = `sepia(${sepia}%) blur(${blur}px) contrast(${contrast}%) grayscale(${grayscale}%) saturate(${saturate}%) brightness(${brightness})`
}

function physics() {

}

function colision() {
    onTheFloor = false
    for (let i = 0; i < floor.length; i++) {
        const floorYStart = +window.getComputedStyle(floor[i]).top.slice(0, -2) - 42
        const floorYEnd = floorYStart + +window.getComputedStyle(floor[i]).height.slice(0, -2)
        const floorStart = +window.getComputedStyle(floor[i]).left.slice(0, -2) - 41
        const floorEnd = +window.getComputedStyle(floor[i]).width.slice(0, -2) + floorStart + 34

        if (inY(floorYStart + 33, floorYEnd) && inX(floorStart, floorStart + 10)) {
            positionX = floorStart
            isMovingRight = false
            playerSpeed = 0
        } else if (inY(floorYStart + 33, floorYEnd) && inX(floorEnd - 10, floorEnd)) {
                positionX = floorEnd
                isMovingLeft = false
                playerSpeed = 0
        } else if (!onTheFloor && inY(floorYStart, floorYStart + 30) && inX(floorStart + 1, floorEnd - 1)) {
            positionY = floorYStart
            onTheFloor = true
        } else if (inY(floorYEnd - 10, floorYEnd + 33.33) && inX(floorStart + 1, floorEnd - 1)) {
            fallSpeed = 3
        }
    }
}

function camera() {
    if (positionX > window.innerWidth * cameraXCount && cameraXCount >= 0) {
        game.style.transform = `translateX(${-window.innerWidth * cameraXCount}px)`
        cameraXCount++
    } else if (positionX < window.innerWidth * cameraXCount) {
        cameraXCount--
    }

}

function inX(start, end) {
    if (positionX >= start && positionX <= end) {
        return true
    } else return false
}

function inY(yStart, yEnd) {
    if (positionY <= yEnd && positionY >= yStart) {
        return true
    } else return false
}

function fall() {
    if (!onTheFloor && countClock % 3 === 0) {
        fallSpeed += 1
    } else if (onTheFloor) {
        fallSpeed = 0
    }
    positionY += fallSpeed
    player.style.transform = `translateY(${positionY}px)`
}

function movePlayer() {
    if (isMovingRight && playerSpeed < maxSpeed) {
        playerSpeed += 0.3
    } else if (isMovingLeft && playerSpeed > -maxSpeed) {
        playerSpeed -= 0.3
    }

    if (isMovingRight && playerSpeed < 0) {
        playerSpeed += 0.6
    } else if (isMovingLeft && playerSpeed > 0) {
        playerSpeed -= 0.6
    }

    if (!isMovingLeft && !isMovingRight && playerSpeed > 0) {
        playerSpeed -= 0.4
    } else if (!isMovingLeft && !isMovingRight && playerSpeed < 0) {
        playerSpeed += 0.4
    }
    if ((playerSpeed < 0.21 && playerSpeed > -0.21) && !isMovingLeft && !isMovingRight) {
        playerSpeed = 0
        angle = 0
    }
    positionX += playerSpeed
    player.style.translate = (positionX) + 'px'
}

function playerAngle() {
    if (isMovingRight && angle < maxAngle) {
        angle += maxAngle / 50 * angleSpeed
    } else if (isMovingLeft && angle > -maxAngle) {
        angle -= maxAngle / 50 * angleSpeed
    }

    if (isMovingRight && angle < 0) {
        angle += maxAngle / 50 * angleSpeed * 2
    } else if (isMovingLeft && angle > 0) {
        angle -= maxAngle / 50 * angleSpeed * 2
    }

    if (!isMovingLeft && !isMovingRight && angle > 0) {
        angle -= maxAngle / 50 * angleSpeed * 1.5
    } else if (!isMovingLeft && !isMovingRight && angle < 0) {
        angle += maxAngle / 50 * angleSpeed * 1.5
    }
    playerStyle.setAttribute('d', `M22 0H${122 + angle}L122 ${tall}H22L${22 + angle} 0Z`)
}


document.onkeydown = (e) => {
    if (e.code === 'KeyD' && playerSpeed < maxSpeed && canInput) {
        isMovingRight = true
    } else if (e.code === 'KeyA' && playerSpeed > -maxSpeed && canInput) {
        isMovingLeft = true
    }

    if (e.code === 'KeyW' && onTheFloor && canInput) {
        fallSpeed = -10
        onTheFloor = false
    }
}

document.onkeyup = (e) => {
    if (e.code === 'KeyD') {
        isMovingRight = false
    } else if (e.code === 'KeyA') {
        isMovingLeft = false
    }
}

document.onmousedown = e => {
    if (e.button === 0 && !turnLight && canInput && tutorial >= 1) {
        turnLight = true
        light.style.display = 'block'
    } else if (e.button === 0 && turnLight && canInput && tutorial >= 1) {
        turnLight = false
        light.style.display = 'none'
    }
}


function Frame() {
    countClock++
    physics()
    camera()
    fall()
    colision()
    movePlayer()
    playerAngle()
    triggers()
    setEffects()
    moveLight()
    moveEnemy()

    requestAnimationFrame(Frame)
}

Frame()