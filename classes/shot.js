class Shot {
    constructor(letter, width = 10, height = 30, speed = 5) {
        this.value = letter.value;
        this.x = letter.x + width;
        this.y = letter.y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    move() {
        this.y -= this.speed;
    }
}