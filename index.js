const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const boardWidth = 560
const boardHeight = 300
const ballDiameter = 20
let vX = 2
let vY = 2
let timerId
let score = 0
let xA = 0;

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

const blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
]

function addBlocks() {
    for (let i = 0; i < blocks.length; ++i) {
        const block = document.createElement('div')
        block.classList.add('block')
        block.style.left = blocks[i].bottomLeft[0] + 'px'
        block.style.bottom = blocks[i].bottomLeft[1] + 'px'
        grid.appendChild(block)

    }
}

addBlocks()

const user = document.createElement('div')
user.classList.add('user')
drawUser()
grid.appendChild(user)

function drawUser() {
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}


function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 10) {
                currentPosition[0] -= 10;
                drawUser()
                xA -= 1
            }
            break
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - blockWidth - 10){
                currentPosition[0] += 10;
                drawUser()
                xA += 1
            }
            break
    }
}

function resetXA() {
    xA = 0;
}

document.addEventListener('keydown', moveUser)
document.addEventListener('keyup', resetXA)

const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)


function moveBall() {
    ballCurrentPosition[0] += vX
    ballCurrentPosition[1] += vY
    drawBall()
    checkForCollisions()
}

timerId = setInterval(moveBall, 30)

function checkForCollisions() {

    //blocks collisions
    for (let i = 0; i < blocks.length; i++) {
        if (   ballCurrentPosition[0] > blocks[i].bottomLeft[0] 
            && ballCurrentPosition[0] < blocks[i].bottomRight[0]
            && ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1]
            && ballCurrentPosition[1] < blocks[i].topLeft[1]
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1)
            vY = -vY
            score++
            scoreDisplay.innerHTML = score

            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'YOU WIN'
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
            }
        }
    }
    
    //wall collisions
    if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= ballDiameter) {
        vX = -vX
    }
    
    if (ballCurrentPosition[1] >= (boardHeight - ballDiameter)) {
        vY = -vY
    }
    
    //user collisions
    if (   ballCurrentPosition[0] > currentPosition[0] 
        && ballCurrentPosition[0] < currentPosition[0] + blockWidth
        && ballCurrentPosition[1] < currentPosition[1] + blockHeight
    ) {
        vY = -vY
        vX += xA
    }

    if(ballCurrentPosition[1] <= 0) {
        clearInterval(timerId)
        scoreDisplay.innerHTML = 'You lose'
        document.removeEventListener('keydown', moveUser)
    }
}