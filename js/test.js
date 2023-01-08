function dash() {
    let timer = 15;
    let timerId
    let number = 35
    function decreaseTimer() {
        if (timer > 0) {
            timerId = setTimeout(decreaseTimer, 17)
            timer--;
            this.position.x = this.position.x - number;
            number *= 0.8;
            number = Math.floor(number)
            this.position.x = Math.floor(this.position.x)
            console.log(this.position.x);
        }
    }
    decreaseTimer();
}

dash();