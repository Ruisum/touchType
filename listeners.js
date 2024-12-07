//add box effect when pressing the letter
document.addEventListener('keydown', event => {
    if (!pressedLetters.includes(event.key.toUpperCase())) {
        pressedLetters.push(event.key.toUpperCase());
    }

    const letter = letters.find(l => l.value === event.key.toUpperCase());

    if (letter) {
        shots.push(new Shot(letter));
    }
});

document.addEventListener('keyup', event => {
    pressedLetters.splice(pressedLetters.indexOf(event.key.toUpperCase()), 1);
});

document.addEventListener('keyup', event => {
if (event.keyCode === 32) {
    cancelAnimationFrame(req);
}
});