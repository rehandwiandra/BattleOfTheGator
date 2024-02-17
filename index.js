//Project Initiation
const scoreEl = document.querySelector('#scoreEl')
const notifEl = document.querySelector('#notifEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1366
canvas.height = 768

//Player Class
class Player{
    constructor(){
        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0
        this.opacity = 1

        const image = new Image()
        image.src = './img/SpaceshipV3.png'

        // Trying to maintain aspect ratio
        image.onload = () => { //Wait for image to load
            const scale = 0.2

            this.image = image
            this.width = image.width * scale
            this.height = image.height  * scale

            this.position = {
                x: (canvas.width / 2) - (this.width / 2),
                y: canvas.height - this.height - 20
            }
        }
        
    }

    draw() {
        // RedBox
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //Save the canvas state
        c.save()
        c.globalAlpha = this.opacity

        //Move the canvas to the player
        c.translate(
            player.position.x + (player.width/2), 
            player.position.y + (player.height/2)
        )
        
        c.rotate(this.rotation)
        
        c.translate(
            -player.position.x - (player.width/2), 
            -player.position.y - (player.height/2)
        )

        // PlayerImage
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        c.restore()
    }

    update() {
        if(this.image){ //Check for image load
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        // Projectile Size
        this.radius = 4
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle {
    constructor({position, velocity, radius, color, fades}){
        this.position = position
        this.velocity = velocity

        // Particle Size
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw(){
        c.save()

        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()

        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.fades)
            this.opacity -= 0.005
    }
}

class InvaderProjectile {
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        // Projectile Size
        this.width = 3
        this.height = 15
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Invader{
    constructor({position}){
        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = './img/InvaderV2.png'

        // Trying to maintain aspect ratio
        image.onload = () => { //Wait for image to load
            const scale = 0.135

            this.image = image
            this.width = image.width * scale
            this.height = image.height  * scale

            this.position = {
                x: position.x,
                y: position.y
            }
        }
        
    }

    draw() {
        // RedBox
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // PlayerImage
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

    }

    update({velocity}) {
        if(this.image){ //Check for image load
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectile){
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width/2,
                y: this.position.y + this.height
            },

            velocity: {
                x: 0,
                y: 3
            }
        }))
    }
}

class Grid{
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 1.5,
            y: 0
        }

        this.invaders = []

        //Create random rows
        const cols = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 3 + 2)

        this.width = cols * 50
        
        for (let x=0; x<cols; x++){
            for (let y=0; y<rows; y++){
                this.invaders.push(new Invader({position: {
                    x: x * 50,
                    y: y * 50
                }}))
            }
        }
    }

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 50
        }
    }
}

//Create Const
const player = new Player()
const projectiles = []
const invaderProjectiles = []
const grids = []
const particles = []

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

//Starting Frame
let frames = 0
//Change enemy spawn interval
let randomInterval = Math.floor((Math.random() * 1000) + 1100)
//Game
let game = {
    over: false,
    active: true
}
//Score
let score = 0

//Star Creation
for (let i=0; i<100; i++){
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        
        velocity: {
            x: 0,
            y: 0.3
        },
        
        color: '#FFFFFF',

        radius: Math.random() * 2

    }))
}

//Animate Particle Function
function createParticles({object, color, fades}){
    for (let i=0; i<15; i++){
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width/2,
                y: object.position.y + object.height/2
            },
            
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            
            radius: Math.random(),
            color: color || 'orange',
            fades: fades
        }))
    }
}

//Animate Function
function animate(){
    if(!game.active) return

    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    //Animate Player
    player.update()

    //Animate Particles
    particles.forEach((particle, i) => {
        if(particle.position.y - particle.radius >= canvas.height){
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }
        if(particle.opacity <= 0){
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        }else{
            particle.update()
        }
    })

    //Invader Projectile
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
            setTimeout(() => {
                invaderProjectiles.splice(index,1)
            }, 0)
        }else{
            invaderProjectile.update()
        }

        if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width
            ){
            //Remove Player
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true
            }, 0);

            //Endgame
            setTimeout(() => {
                game.active = false
            }, 1000);

            //Projectile hit player
            createParticles({
                object: player,
                color: 'red',
                fades: true
            })

            //Alert
            notifEl.innerHTML = "YOU LOSE!"
            alert('You Lose! Score: ' + score)
        }
    })

    //Animate Player Projectile
    projectiles.forEach((projectile, index)=> {
        if(projectile.position.y + projectile.radius <= 0){
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }else{
            projectile.update()
        }
    })

    //Create Grid
    grids.forEach((grid, gridIndex) =>{
        grid.update()

        //Spawn Enemy Projectile
        if(frames % 100 === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }

        grid.invaders.forEach((invader, i) =>{
            invader.update({velocity: grid.velocity})

            // Remove Invader (Collision detection)
            projectiles.forEach((projectile, j) => {
                if(projectile.position.y - projectile.radius <= invader.position.y + invader.height && 
                    projectile.position.x + projectile.radius >= invader.position.x && 
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y
                    ){
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find((invader2) => 
                            invader2 === invader
                        )

                        const projectileFound = projectiles.find((projectile2) => 
                            projectile2 === projectile
                        )

                        if (invaderFound && projectileFound){ //Check if invader and projectile is found
                            //Add score
                            score += 1
                            scoreEl.innerHTML = score

                            // Create Particle for Invaders
                            createParticles({
                                object: invader,
                                color: 'red',
                                fades: true
                            })
                            
                            //Remove Projectile and Invader
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)
                            
                            // Checking Invader's grid width
                            if(grid.invaders.length > 0){
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width

                                grid.position.x = firstInvader.position.x
                            }else{
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })  
        })
    })

    //Player Speed
    const speed = 5;

    if (keys.a.pressed && player.position.x >= 0){
        player.velocity.x = -speed
        player.rotation = -0.5
    }else if (keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = speed
        player.rotation = 0.5
    }else{
        player.velocity.x = 0
        player.rotation = 0
    }

    //Spawn Enemy
    if(frames % randomInterval === 0){
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random() * 1500) + 1500) 
        frames = 0
    }

    frames++
}

//Animate the image and background
animate()

addEventListener('keydown', ({key}) => {
    if(game.over) return

    switch(key){
        case 'a':
            // console.log('left')
            keys.a.pressed = true
            break
        case 'd':
            // console.log('right')
            keys.d.pressed = true
            break
        case ' ':
            // console.log('shoot')
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width/2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -5
                    }
                })
            )
            // console.log(projectiles)
            break
    }
})

addEventListener('keyup', ({key}) => {
    switch(key){
        case 'a':
            // console.log('left')
            keys.a.pressed = false
            break
        case 'd':
            // console.log('right')
            keys.d.pressed = false
            break
        case ' ':
            // console.log('shoot')
            break
    }
})