const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const letterBoxSize = 30;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
canvas.height = letterBoxSize * 15;
canvas.width = letterBoxSize * alphabet.length;
let count = 0;
const letters = alphabet.map(letter => {
    const letterObject = new Letter(letter, count * letterBoxSize, canvas.height, letterBoxSize, letterBoxSize);
    count++;
    return letterObject;
});
const fallingLetters = letters.map(letter => {
    return new FallingLetter(letter.value, letter.x, -letter.height, letter.width, letter.height, 5);
});

const getFallingLetter = (letter, speed) => {
    return new FallingLetter(letter.value, letter.x, -letter.height, letter.width, letter.height, speed);
}

const isColliding = (object1, object2) => {
    return object1.x <= object2.x + object2.width &&
        object1.x + object1.width >= object2.x &&
        object1.y <= object2.y + object2.height - object2.speed &&
        object1.y + object1.height - object1.speed >= object2.y;
}

let letterCount = 0;
let loopCount = 0;
let lastLeftLetter = '';
let lastRightLetter = '';

ctx.textBaseline = 'alphabetic';
ctx.font = '40px monospace';
ctx.textAlign = 'start';
const letterRowHeight = canvas.height - letterBoxSize;
let pressedLetters = [];
let shots = [];
let leftLetter, rightLetter;
let fallingLetter;
let req;
let score = 0;
let state = 'start';

const STATES = {START: 'start', RUN:'run', END: 'finish'};

const startButton = new Button('Start', (canvas.width / 2) - 75, (canvas.height / 2) - 25, 125, 40);
const restartButton = new Button('Replay', (canvas.width / 2) - 75, canvas.height / 2, 145, 40);
canvas.addEventListener('click', event => {
    if (event.pageX >= startButton.x &&
        event.pageX <= startButton.x + startButton.width &&
        event.pageY >= startButton.y &&
        event.pageY <= startButton.y + startButton.height &&
        state === STATES.START
    ) {
        state = STATES.RUN;
    }
    if (event.pageX >= restartButton.x &&
        event.pageX <= restartButton.x + restartButton.width &&
        event.pageY >= restartButton.y &&
        event.pageY <= restartButton.y + restartButton.height &&
        state === STATES.END
    ) {
        state = STATES.RUN;
    }
   });
   

const write = (letter, withStroke = true) => {
    if (withStroke) {
        ctx.strokeRect(letter.x, letter.y - letter.height, letter.width, letter.height);
    }
    ctx.fillText(letter.value, letter.x, letter.y, letter.width);
}

const scoreText = (score, font = '12px serif', x = 5, y = 10) => {
    const originalText = ctx.font;
    ctx.font = font;
    ctx.fillText(`Score: ${score}`, x, y);
    ctx.font = originalText;
}

// const drawStartButton = () => {
//     ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
//     ctx.textBaseline = "top";
//     ctx.fillStyle = 'white';
//     ctx.fillText(startButton.text, startButton.x + 8, startButton.y, startButton.width, startButton.height);
//     ctx.fillStyle = 'black';
//     ctx.textBaseline = "alphabetic";
// }

const drawButton = button => {
    ctx.fillRect(button.x, button.y, button.width, button.height);
    ctx.textBaseline = "top";
    ctx.fillStyle = 'white';
    ctx.fillText(button.text, button.x + 8, button.y, button.width, button.height);
    ctx.fillStyle = 'black';
    ctx.textBaseline = "alphabetic";
}

const run = () => {
    letters.forEach(letter => {
        if (pressedLetters.includes(letter.value)) {
            ctx.fillStyle = 'green';
            ctx.fillRect(letter.x, letter.y - letter.height, letter.width, letter.height);
            ctx.fillStyle = 'black';
        }
        write(letter);
    });

    for (let i = 0; i < shots.length; i++) {
        shots[i].move();
        ctx.fillStyle = 'green';
        ctx.fillRect(shots[i].x, shots[i].y, shots[i].width, shots[i].height);
        ctx.fillStyle = 'black';

        if (fallingLetter && isColliding(shots[i], fallingLetter)) {
            fallingLetter = null;
            shots.splice(i, 1);
            score++;
        }

        if (shots[i] && shots[i].y < -shots[i].height) {
            shots.splice(i, 1);
        }

    }

    if (!fallingLetter) {
        const index = Math.floor(Math.random() * letters.length);
        fallingLetter = getFallingLetter(letters[index], 1 + score / 10);
    }

    if (fallingLetter && fallingLetter.y <= canvas.height) {
        ctx.textBaseline = "top";
        ctx.fillText(fallingLetter.value, fallingLetter.x + 3.5, fallingLetter.y - 2, fallingLetter.width);
        ctx.textBaseline = "alphabetic";
        fallingLetter.move();
    }

    if (fallingLetter && fallingLetter.y > canvas.height) {
        //fallingLetter = null;
        state = STATES.END;
    }

    scoreText(score);
}

const endScreen = () => {
    // ToDo
    

}

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (state === STATES.START) {
        drawButton(startButton);
    } else if (state === STATES.RUN) {
        run();
    } else if (state === STATES.END) {
        scoreText(`Your score is: ${score}`, '20px serif', (canvas.width / 2) - 80, (canvas.height / 2) - 60);
        drawButton(restartButton);
        endScreen();
    }
    

    req = requestAnimationFrame(animate);
};

animate();
