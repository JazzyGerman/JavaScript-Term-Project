let canvas, ctx;
let chickenImg = new Image();
let bgImg = new Image();
let chicken = { x: 50, y: 50, width: 40, height: 40 }; // Start at (1,1)
let tileSize = 50;
let rows = 12;
let cols = 18;
let obstacles = [];
let goal = { x: cols - 2, y: rows - 2 }; // Goal is at (16,10)

function startGame() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    chickenImg.src = "media/chicken.png";
    bgImg.src = "media/chickenMazeBackground.jpg";

    chickenImg.onload = () => {
        generateObstacles();
        drawGame();
    };

    document.addEventListener("keydown", moveChicken);
}

function drawGame() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Draw obstacles
    ctx.fillStyle = "rgba(139,69,19,0.8)";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x * tileSize, obs.y * tileSize, tileSize, tileSize);
    });

    // Draw goal tile
    ctx.fillStyle = "rgba(0, 255, 0, 0.6)";
    ctx.fillRect(goal.x * tileSize, goal.y * tileSize, tileSize, tileSize);

    // Add "GOAL" text on the goal square
    ctx.fillStyle = "#000"; // black text
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GOAL", goal.x * tileSize + tileSize / 2, goal.y * tileSize + tileSize / 2);



    // Draw chicken
    ctx.drawImage(chickenImg, chicken.x, chicken.y, chicken.width, chicken.height);
}

function generateObstacles() {
    obstacles = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Add border walls
            if (x === 0 || y === 0 || x === cols - 1 || y === rows - 1) {
                obstacles.push({ x, y });
                continue;
            }

            // Random internal walls (about 25%)
            if (
                Math.random() < 0.25 &&
                !(x === 1 && y === 1) && // Don't block start
                !(x === goal.x && y === goal.y) // Don't block goal
            ) {
                obstacles.push({ x, y });
            }
        }
    }
}

function moveByButton(direction) {
    moveChicken({ key: direction });
}

function moveChicken(e) {
    let dx = 0, dy = 0;
    if (e.key === "ArrowUp") dy = -tileSize;
    else if (e.key === "ArrowDown") dy = tileSize;
    else if (e.key === "ArrowLeft") dx = -tileSize;
    else if (e.key === "ArrowRight") dx = tileSize;
    else return;

    let newX = chicken.x + dx;
    let newY = chicken.y + dy;

    // Stay within bounds
    if (newX < 0 || newY < 0 || newX + chicken.width > canvas.width || newY + chicken.height > canvas.height) return;

    let gridX = newX / tileSize;
    let gridY = newY / tileSize;

    // Check for wall hit = game over
    if (obstacles.some(obs => obs.x === gridX && obs.y === gridY)) {
        setTimeout(() => {
            alert("💥 You hit a barrier! Game Over.");
            location.reload();
        }, 100);
        return;
    }


    // Move
    chicken.x = newX;
    chicken.y = newY;
    drawGame();

    // Check win
    if (gridX === goal.x && gridY === goal.y) {
        setTimeout(() => {
            alert("🎉 You win!");
            location.reload(); // Restart the game
        }, 100);
    }
}
