const player = document.querySelector('.player')
const playerStyle = document.querySelector('.player-style')
const solids = document.querySelectorAll('.solid')
const floor = document.querySelectorAll('.floor')
const game = document.querySelector('.game')

const maxAngle = 22

let angle = 0
let tall = 100
let playerSpeed = 0
let maxSpeed = 10
let fallSpeed = 0
let positionX = -10
let positionY = 0
const screenW = window.innerWidth

let countClock = 0


let isJump = false
let onTheFloor = false
let isMovingRight = false
let isMovingLeft = false

function colision() {
    onTheFloor = false
    for (let i = 0; i < floor.length; i++) {
        const floorYStart = +window.getComputedStyle(floor[i]).top.slice(0, -2) - 42
        const floorYEnd = floorYStart + +window.getComputedStyle(floor[i]).height.slice(0, -2)
        const floorStart = +window.getComputedStyle(floor[i]).left.slice(0, -2) - 42
        const floorEnd = +window.getComputedStyle(floor[i]).width.slice(0, -2) + floorStart + 33.33

        if (inY(floorYStart + 33.33, floorYEnd) && inX(floorStart, floorStart + 10)) {
            positionX = floorStart
            isMovingRight = false
            playerSpeed = 0
        }   else if (inY(floorYStart + 33.33, floorYEnd) && inX(floorEnd - 10, floorEnd)) {
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
        angle += maxAngle / 50 * 10
    } else if (isMovingLeft && angle > -maxAngle) {
        angle -= maxAngle / 50 * 10
    }

    if (isMovingRight && angle < 0) {
        angle += maxAngle / 50 * 20
    } else if (isMovingLeft && angle > 0) {
        angle -= maxAngle / 50 * 20
    }

    if (!isMovingLeft && !isMovingRight && angle > 0) {
        angle -= maxAngle / 50 * 15
    } else if (!isMovingLeft && !isMovingRight && angle < 0) {
        angle += maxAngle / 50 * 15
    }
    playerStyle.setAttribute('d', `M22 0H${122 + angle}L122 ${tall}H22L${22 + angle} 0Z`)
}


document.onkeydown = (e) => {
    if (e.code === 'KeyD' && playerSpeed < maxSpeed) {
        isMovingRight = true
    } else if (e.code === 'KeyA' && playerSpeed > -maxSpeed) {
        isMovingLeft = true
    }

    if (e.code === 'KeyW' && onTheFloor) {
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

function Frame() {

    countClock++
    fall()
    colision()
    movePlayer()
    playerAngle()

    requestAnimationFrame(Frame)
}

Frame()