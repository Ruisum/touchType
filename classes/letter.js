class Letter {
    constructor(value, x, y, width, height) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class FallingLetter extends Letter {
    constructor(value, x, y, width, height, speed) {
        super(value, x, y, width, height);
        this.speed = speed;
    }

    move() {
        this.y += this.speed;
    }
}