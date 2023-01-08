const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

let gravity = 0.7;
const playerStartPosition = {
    x: 0,
    y: 0,
}
const enemyStartPosition = {
    x: canvas.width - 50,
    y: 0
}
function finishRound() {
        console.log('round finished');
        determineWinner({player, enemy, timerId});
        setTimeout(newRoundCountDown,3000);
}

let newRoundTimer = 4;
let newRoundTimerId;
function firstRoundCountDown() {
    document.querySelector('#display-text').style.display = 'flex';
    newRoundTimer--;
    if (newRoundTimer > 0) {
        console.log(`Round starts in ${newRoundTimer}`)
        document.querySelector('#display-text').innerHTML = `Round starts in ${newRoundTimer}`;
        newRoundTimerId = setTimeout(firstRoundCountDown, 1000)
    }
    if (newRoundTimer === 0) {
        clearTimeout(newRoundTimerId);
        newRound();
        newRoundTimer = 4;
    }
}
function newRoundCountDown() {
    newRoundTimer--;
    if (newRoundTimer > 0) {
        document.querySelector('#display-text').innerHTML = `New round in ${newRoundTimer}`;
        newRoundTimerId = setTimeout(newRoundCountDown, 1000)
    }
    if (newRoundTimer === 0) {
        clearTimeout(newRoundTimerId);
        newRound();
        newRoundTimer = 4;
    }
}

function newRound() {
    console.log('New Round')
    player.position.x = playerStartPosition.x;
    enemy.position.x = enemyStartPosition.x;
    player.resetCharacter();
    enemy.resetCharacter();
    player.dead = false;
    enemy.dead = false;
    document.querySelector('#player-health').style.width = player.health + "%";
    document.querySelector('#player-stamina').style.width = player.health + "%";
    document.querySelector('#enemy-health').style.width = enemy.health + "%";
    document.querySelector('#enemy-stamina').style.width = enemy.health + "%";
    document.querySelector('#display-text').style.display = 'none';
    timer = 60;
    decreaseTimer();
}



context.fillRect(0, 0, canvas.width, canvas.height);


const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: canvas.height - 96
    },
    startPosition: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        attack2: {
            imageSrc: './img/samuraiMack/Attack2.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        },
        dash: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 160,
        height: 50
    },
    movementSpeed: 9,
    attackDamage: 10,
    name: 'player',
    skillProp: {
        attack1: {
            onCooldown: false,
            cooldownTime: 450,
            staminaCost: 27
        },
        dash: {
            onCooldown: false,
            cooldownTime: 300,
            staminaCost: 25
        }
    },
})

const enemy = new Fighter({
    position: {
        x: canvas.width - 50,
        y: canvas.height - 96
    },
    startPosition: {
        x: canvas.width - 50,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'orange',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        attack2: {
            imageSrc: './img/kenji/Attack2.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    },
    movementSpeed: 7,
    attackDamage: 6,
    name: 'enemy',
    skillProp: {
        attack1: {
            onCooldown: false,
            cooldownTime: 300,
            staminaCost: 18
        },
        dash: {
            onCooldown: false,
            cooldownTime: 300,
            staminaCost: 25
        }
    }
})

const keys = {
    // player controls
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    spaceBar: {
        pressed: false
    },
    // enemy controls
    zero: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    context.fillStyle = 'rgba(255, 255, 255, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    enemy.update();
    
    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey === 'a' && player.position.x > 0 && !player.disabled) {
        player.velocity.x = -player.movementSpeed;
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x + player.width < canvas.width && !player.disabled) {
        player.velocity.x = player.movementSpeed;
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // player jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // dasH


    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x > 0 && !enemy.disabled) {
        enemy.velocity.x = -enemy.movementSpeed;
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x + enemy.width < canvas.width && !enemy.disabled) {
        enemy.switchSprite('run')
        enemy.velocity.x = enemy.movementSpeed;
    } else {
        enemy.switchSprite('idle')
    }

    // enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // player attack (detect for collision, damage)
    if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
        }) &&
        player.isAttacking && 
        player.framesCurrent === 4
    ) {
        if (!enemy.dead) enemy.takeHit(player.damage);
        player.isAttacking = false;
        document.querySelector('#enemy-health').style.width = enemy.health + "%";
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }
    // enemy attack (detect for collision, damage)
    if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
        ) {
        if (!player.dead) player.takeHit(enemy.damage);
        enemy.isAttacking = false;
        document.querySelector('#player-health').style.width = player.health + "%";
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }
    // AI
    if (!enemy.disabled && !enemy.dead && !player.dead) {
        if (enemy.position.x - player.position.x > 400) enemy.dash();
        if (player.position.x > enemy.attackBox.position.x + enemy.attackBox.width + 100) enemy.dash2();
        if (enemy.attackBox.position.x > player.position.x) {
            enemy.velocity.x = -enemy.movementSpeed;
        } else if (enemy.attackBox.position.x + player.width < player.position.x) {
            enemy.velocity.x = enemy.movementSpeed;
        }
        if (rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })) {
            if (player.velocity.y > 10) enemy.jump();
            enemy.attack();
        }}

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        //determineWinner({player, enemy, timerId});
    }

    // certain death
    if (player.health === 0) {player.switchSprite('death')}
    if (enemy.health === 0) {enemy.switchSprite('death')}

    // restart
}

animate();
firstRoundCountDown();
player.disabled = true;
enemy.disabled = true;

window.addEventListener('keypress', (event) => {
    // player controls
    switch (event.key) {
        case 'q':
        initiateNewRound();
        break;
    }
    if (!player.disabled) {
        switch (event.key) {
            case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
            case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
            case ' ':
            player.jump();
            break;
            case 'j':
            player.attack();
            break;
            case 'k':
            player.dash();
            break;
            case 'l':
            player.dash2();
            break;
        }
}

    // enemy controls
    if (!enemy.disabled) {
        switch (event.key) {
            case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
            case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
            case 'ArrowDown':
            enemy.attack();
            break;
            case '0':
            enemy.jump();
            break;
            case 'ű':
            enemy.dash();
            break;
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        // player controls
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        // enemy controls
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            enemy.lastKey = 'ArrowLeft'
            break
    }
})
