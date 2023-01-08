class Sprite {
    constructor({ position, startPosition, imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0} }) {
        this.position = position;
        this.startPosition = startPosition;
        this.width = 50;
        this.height = 150;
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }
    
    draw() {
        context.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
            )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({ 
        position,
        velocity,
        color='red', 
        imageSrc, 
        scale = 1,
        framesMax = 1,
        offset = { x:0, y:0 }, 
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined},
        movementSpeed,
        attackDamage,
        criticalChance = 5,
        name,
        skillProp,
        staminaRegen = 0.6
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites
        this.color = color;
        this.name = name
        this.dead = false
        this.disabled = false
        this.invincible = false
        this.health = 100
        this.stamina = 100
        this.staminaRegen = staminaRegen
        this.isAttacking
        this.damage
        this.attackDamage = attackDamage
        this.criticalChance = criticalChance
        this.movementSpeed = movementSpeed
        this.skillProp = skillProp
        this.takeHitCooldown = false;
        this.chainAttack = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        this.draw();
        if (!this.dead) this.animateFrames();
        
        if (this.stamina < 100) {
            this.stamina = (this.stamina + this.staminaRegen);
            if (this.stamina > 100) this.stamina = 100;
            let _this = this
            document.querySelector(`#${_this.name}-stamina`).style.width = this.stamina + "%";
        }
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        // draw attack box
        // context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else this.velocity.y += gravity;
    }



    resetCooldown(skill) {
        switch (skill) {
            case 'attack1':
                this.skillProp.attack1.onCooldown = false;
                break;
            case 'dash':
                this.skillProp.dash.onCooldown = false;
                break;
            case 'takehit':
                this.takeHitCooldown = false;
                break;

        }
    }

    jump() {
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96 && this.stamina >= 15 ) {
            this.decreaseStamina(15);
            this.velocity.y = -20;
        }
    }

    attack() {
        if (!this.skillProp.attack1.onCooldown && this.stamina >= this.skillProp.attack1.staminaCost && !this.disabled){
            this.skillProp.attack1.onCooldown = true;
            if (!this.chainAttack) this.attackBox.width = 160
            if (this.chainAttack) this.attackBox.width = 170
            let _this = this
            // cooldown
            let cooldownTime = this.skillProp.attack1.cooldownTime
            setTimeout(function () {
                _this.resetCooldown('attack1')
            }, cooldownTime);
            // damage & hit
            this.damage = this.attackDamage + (Math.ceil((Math.random() * this.attackDamage)/4))
            if (Math.random() * 100 > 100 - this.criticalChance) this.damage *= 2
            this.isAttacking = true;
            if (!this.chainAttack) this.switchSprite('attack1');
            if (this.chainAttack) this.switchSprite('attack2');
            this.chainAttack = !this.chainAttack;
            // stamina
            let staminaCost = this.skillProp.attack1.staminaCost;
            this.decreaseStamina(staminaCost);
        }
    }
    
        dash() {
            if (!this.skillProp.dash.onCooldown && this.stamina >= 25) {
                let _this = this
                // cooldown
                this.skillProp.dash.onCooldown = true;
                let cooldownTime = this.skillProp.dash.cooldownTime
                setTimeout(function () {
                    _this.resetCooldown('dash')
                }, cooldownTime);
                this.invincible = true;
                setTimeout(function() {_this.dashInvincibility()},250)
                let staminaCost = this.skillProp.dash.staminaCost
                this.decreaseStamina(staminaCost);
                this.velocity.y = -5;
                let timer = 20;
                let timerId;
                let counter = 50;
                function moveSprite() {
                    if (timer > 0 && _this.position.x > 0) {
                        timerId = setTimeout(moveSprite, 17);
                        timer--;
                        _this.position.x = _this.position.x - counter;
                        counter *= 0.8;
                        counter = Math.floor(counter);
                        _this.position.x = Math.floor(_this.position.x);
                    }
                }
                moveSprite();
                this.switchSprite('dash');
            }
        }

        dash2() {
            if (!this.skillProp.dash.onCooldown && this.stamina >= 25) {
                let _this = this
                // cooldown
                this.skillProp.dash.onCooldown = true;
                let cooldownTime = this.skillProp.dash.cooldownTime
                setTimeout(function () {
                    _this.resetCooldown('dash')
                }, cooldownTime);
                this.invincible = true;
                setTimeout(function() {_this.dashInvincibility()},250)
                let staminaCost = this.skillProp.dash.staminaCost
                this.decreaseStamina(staminaCost);
                this.velocity.y = -5;
                let timer = 20;
                let timerId;
                let counter = 50;
                function moveSprite() {
                    if (timer > 0 && _this.position.x < 1024) {
                        timerId = setTimeout(moveSprite, 17);
                        timer--;
                        _this.position.x = _this.position.x + counter;
                        counter *= 0.8;
                        counter = Math.floor(counter);
                        _this.position.x = Math.floor(_this.position.x);
                    }
                }
                moveSprite();
                this.switchSprite('dash');
            }
        }

        dashInvincibility() {
            this.invincible = false;
        }

    heal() {
        this.health += 20;
        if (this.health > 100) {
            this.health = 100;
        }
        document.querySelector('#player-health').style.width = player.health + "%";
    }

    decreaseStamina(value) {
        this.stamina -= value;
        if (this.stamina < 0) {
            this.stamina = 0;
            document.querySelector(`#${_this.name}-stamina`).style.width = this.stamina + "%";
        }
    }

    takeHit(damage) {if(!this.invincible || !this.takeHitCooldown){
        this.takeHitCooldown = true;
        let _this = this;
        setTimeout(function () {
            _this.resetCooldown('takeHit')
        }, 100);

        this.health -= damage;
        console.log(`${this.name} takes ${damage}`)

        if (this.health <= 0) {
            finishRound();
            this.health = 0;
            this.staminaRegen = 0;
            this.stamina = 0;
            this.invincible = true;
            this.disabled = true;
            this.switchSprite('death')
        } else if (this.image === this.sprites.attack1.image) {
            return;
        } else this.switchSprite('takeHit')}
    }

    resetCharacter() {
        // reset characters
        this.health = 100;
        this.stamina = 100;
        this.staminaRegen = 0.6
        this.disabled = false;
        this.invincible = false;
        this.dead = false;
        this.image = null
        this.switchSprite('idle');
        this.animateFrames();
        // add point to winner
    }

    switchSprite(sprite) {
        // overriding all other with death
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
            //if (this.image === this.sprites.death.image)
            this.dead = true;
            return;
        }

        // overriding all other animations with the attack animation
        if (
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax -1 
            ) 
            return;
        if (
            this.image === this.sprites.attack2.image &&
            this.framesCurrent < this.sprites.attack2.framesMax -1 
            ) 
            return;    

        // override when player gets hit
        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax -1
            ) 
            return;

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax   
                    this.framesCurrent = 0
                    }
                break;
            case 'attack2':
                if (this.image !== this.sprites.attack2.image) {
                    this.image = this.sprites.attack2.image;
                    this.framesMax = this.sprites.attack2.framesMax   
                    this.framesCurrent = 0
                    }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax   
                    this.framesCurrent = 0
                    }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax   
                    this.framesCurrent = 0
                    }
                break;
            case 'dash':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break;    
        }
    }
}