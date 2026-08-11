const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");

let score = 0;
let running = true;


let x = 100;
let y = 220;

player.style.left = x + "px";
player.style.top = y + "px";


let keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});


function movePlayer() {

    if (!running) return;

    let speed = 5;

    if (keys["ArrowUp"] || keys["w"] || keys["W"])
        y -= speed;

    if (keys["ArrowDown"] || keys["s"] || keys["S"])
        y += speed;

    if (keys["ArrowLeft"] || keys["a"] || keys["A"])
        x -= speed;

    if (keys["ArrowRight"] || keys["d"] || keys["D"])
        x += speed;

    x = Math.max(0, Math.min(x, gameArea.clientWidth - player.offsetWidth));
    y = Math.max(0, Math.min(y, gameArea.clientHeight - player.offsetHeight));

    player.style.left = x + "px";
    player.style.top = y + "px";

    requestAnimationFrame(movePlayer);
}

movePlayer();


function spawnArrow() {

    if (!running) return;

    const arrow = document.createElement("div");
    arrow.classList.add("arrow");

    let side = Math.floor(Math.random() * 4);

    let posX, posY;
    let dx, dy;

    let speed = 4 + Math.min(score / 10, 8);

    switch (side) {

        
        case 0:
            posX = -80;
            posY = Math.random() * (gameArea.clientHeight - 20);
            dx = speed;
            dy = 0;
            break;

       
        case 1:
            posX = gameArea.clientWidth + 80;
            posY = Math.random() * (gameArea.clientHeight - 20);
            dx = -speed;
            dy = 0;
            arrow.style.transform = "rotate(180deg)";
            break;

       
        case 2:
            posX = Math.random() * (gameArea.clientWidth - 60);
            posY = -60;
            dx = 0;
            dy = speed;
            arrow.style.transform = "rotate(90deg)";
            break;

        
        case 3:
            posX = Math.random() * (gameArea.clientWidth - 60);
            posY = gameArea.clientHeight + 60;
            dx = 0;
            dy = -speed;
            arrow.style.transform = "rotate(-90deg)";
            break;
    }

    arrow.style.left = posX + "px";
    arrow.style.top = posY + "px";

    gameArea.appendChild(arrow);

    const move = setInterval(() => {

        if (!running) {
            clearInterval(move);
            return;
        }

        posX += dx;
        posY += dy;

        arrow.style.left = posX + "px";
        arrow.style.top = posY + "px";

        checkCollision(arrow);

        if (
            posX < -150 ||
            posX > gameArea.clientWidth + 150 ||
            posY < -150 ||
            posY > gameArea.clientHeight + 150
        ) {
            clearInterval(move);
            arrow.remove();

            score++;
            scoreText.textContent = score;
        }

    }, 20);
}


function checkCollision(arrow) {

    const p = player.getBoundingClientRect();
    const a = arrow.getBoundingClientRect();

    if (
        p.left < a.right &&
        p.right > a.left &&
        p.top < a.bottom &&
        p.bottom > a.top
    ) {
        running = false;
        gameOverText.style.display = "block";
    }
}


setInterval(() => {

    if (running) {
        spawnArrow();
    }

}, 800);