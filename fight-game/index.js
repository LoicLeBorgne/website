const canvas = document.querySelector('canvas');
//this is a 2d game
const c = canvas.getContext('2d')

//Size of the canvas, for now until better solution
const canvas_width = 1024;
const canvas_height = 576;


//Setting the size of the canvas for the screen
canvas.width = canvas_width;
canvas.height = canvas_height;

//Background color to see where we are for now
c.fillRect(0, 0, canvas_width, canvas_height);

const gravity = 0.7

//Creating player & enemy
// constructor({ position, velocity })  means that we don't need to have position AND velocity but only one of each of both
class Sprite {
    constructor({ position, velocity, color, attackBoxColor, offset }) {
        this.position = position
        this.velocity = velocity
        //Size of a character, for now
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
            color: attackBoxColor,
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    //Draw the form of a player - a player is 50 big 150 high
    draw() {
        c.fillStyle = this.color
        c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        //Attack box
        if (this.isAttacking) {
            c.fillStyle = this.attackBox.color
            c.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        }
        else //Player are not at the bottom -> gravity fall
        {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
}
//Create new player on the left of the screen with a 0 velocity
const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    color: 'red',
    attackBoxColor: 'green'
})

//Create new player at the right with a 0 velocity
const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 4
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue',
    attackBoxColor: 'green'
})

console.log(player)
console.log(enemy)

//Solution for Pushing both A or D keys when moving stop the movement completly
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },

    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    }
}

//
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}


//Creating gravity loop
function animate() {
    window.requestAnimationFrame(animate);
    //Background color for now
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    //Default velocity is 0 (not moving)
    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }

    //Enemy
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    //Detect for collition
    //Player is attacking
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ) {
        console.log('player attack')
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    //Enemy is attacking
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {
        console.log('enemy attack')
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }
}

animate()

//Pushing buttons events
window.addEventListener('keydown', (event) => {

    switch (event.key) {
        //Player keys
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            keys.w.pressed = true
            player.velocity.y = -20
            player.lastKey = 'w'
            break
        case 's':
            keys.s.pressed = true
            player.lastKey = 's'
            break
        //Space bar key
        case ' ':
            player.attack()
            break

        //Enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            enemy.velocity.y = -20
            enemy.lastKey = 'ArrowUp'
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = true
            enemy.attack()
            enemy.lastKey = 'ArrowDown'
            break
    }
    //console.log(event.key)
})
//Releasing buttons events
window.addEventListener('keyup', (event) => {

    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = false
            player.lastKey = 'a'
            break
        case 'w':
            keys.w.pressed = false
            player.lastKey = 'w'
            break
        case 's':
            keys.s.pressed = false
            player.lastKey = 's'
            break

        //Enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            enemy.lastKey = 'ArrowUp'
            break
        case 'ArrowDown':
            keys.ArrowDown.pressed = false
            enemy.lastKey = 'ArrowDown'
            break
    }
    //console.log(event.key)
})