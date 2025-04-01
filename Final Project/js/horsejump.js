var myGamePiece;
var myBackground;
var myObstacles = [];
var myScore;
var gameOverText;

function startGame() {
    document.getElementById("playAgain").style.visibility = "hidden";
    myGamePiece = new component(100, 70, "media/horsejump-horse.png", 10, 250, "image");
    myBackground = new component(900, 600, "media/horsejump-background.jpg", 0, 0, "background");
    myScore = new component("30px", "Consolas", "white", 10, 30, "text");
    gameOverText = new component("70px", "Orbitron", "red", 210, 320, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.getElementById("gameCanvas"),
    start: function () {
        this.canvas.width = 900;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;  // Reset speed when key is released
            if (e.keyCode == 37 || e.keyCode == 39) {
                myGamePiece.speedX = 0;  // Stop horizontal movement when left/right arrow is released
            }
            if (e.keyCode == 38 || e.keyCode == 40) {
                myGamePiece.speedY = 0;  // Stop vertical movement when up/down arrow is released
            }
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
};

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    // Add the crashWith method to detect collisions
    this.crashWith = function(otherComponent) {
        var myLeft = this.x;
        var myRight = this.x + this.width;
        var myTop = this.y;
        var myBottom = this.y + this.height;
        var otherLeft = otherComponent.x;
        var otherRight = otherComponent.x + otherComponent.width;
        var otherTop = otherComponent.y;
        var otherBottom = otherComponent.y + otherComponent.height;

        // Check if there is a collision
        var crash = true;
        if (myBottom < otherTop || myTop > otherBottom || myRight < otherLeft || myLeft > otherRight) {
            crash = false;
        }
        return crash;
    };

    this.update = function () {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
    };
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    };
}

function updateGameArea() {
    var x, height, gap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            myGameArea.clear();
            myBackground.update();
            myScore.text = "SCORE: " + myGameArea.frameNo;
            myScore.update();
            gameOverText.text = "GAME OVER";
            gameOverText.update();
            document.getElementById("playAgain").style.visibility = "visible";
            return;
        }
    }
    myGameArea.clear();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyInterval(110)) {
        x = myGameArea.canvas.width;
        height = Math.floor(Math.random() * 200) + 50;  // Random height between 50 and 250
        gap = 200;
        myObstacles.push(new component(40, height, "#8B4513", x, 0));  // Top obstacle
        myObstacles.push(new component(40, myGameArea.canvas.height - height - gap, "#8B4513", x, height + gap));  // Bottom obstacle
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -3;
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    // Handle movement based on keys held down
    if (myGameArea.keys && myGameArea.keys[37]) { 
        myGamePiece.speedX = -3; 
    }  // Left arrow
    if (myGameArea.keys && myGameArea.keys[39]) { 
        myGamePiece.speedX = 3; 
    }   // Right arrow
    if (myGameArea.keys && myGameArea.keys[38]) { 
        myGamePiece.speedY = -3; 
    }  // Up arrow
    if (myGameArea.keys && myGameArea.keys[40]) { 
        myGamePiece.speedY = 3; 
    }   // Down arrow
    
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyInterval(n) {
    return (myGameArea.frameNo / n) % 1 === 0;
}
