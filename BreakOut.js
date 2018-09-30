import { game, Sprite } from "./sgc/sgc.js";

game.setBackground("grass.png");

class Wall extends Sprite {
    constructor(x, y, name, image) {
        super();
        this.x = x;
        this.y = y;
        this.name = "name";
        this.setImage(image);
        this.accelerateOnBounce = false;
    }
}

//Creates walls
new Wall(0, 0, "A spooky castle wall", "castle.png");
let leftWall = new Wall(0, 200, "Left side Wall", "wall.png");
let rightWall = new Wall(game.displayWidth - 48, 200, "Right side Wall", "wall.png");


//Creates Princess Class
class Princess extends Sprite {

    constructor() {
        super();
        this.name = "Princess Ann";
        this.setImage("ann.png");
        this.height = 48;
        this.width = 48;
        this.x = game.displayWidth / 2;
        this.y = game.displayHeight - this.height;
        this.speedWhenWalking = 150;
        this.lives = 1;
        this.accelerateOnBounce = false;
        this.defineAnimation("left", 9, 11);
        this.defineAnimation("right", 3, 5);
        this.lives = 3;
    }

    // Move Left  
    handleLeftArrowKey() {
        this.playAnimation("left");
        this.speed = this.speedWhenWalking;
        this.angle = 180;
    }

    // Move Right
    handleRightArrowKey() {
        this.playAnimation("right");
        this.speed = this.speedWhenWalking;
        this.angle = 0;
    }

    // Keeps the Princess in the Playing Area
    handleGameLoop() {
        this.speed = 0;
        this.x = Math.min(game.displayWidth - rightWall.width - this.width, this.x);
        this.x = Math.max(leftWall.width, this.x);
    }

    handleCollision(otherSprite) {
        // Horizontally, Ann's image file is about one-third blank, one-third Ann, and one-third blank.
        // Vertically, there is very little blank space. Ann's head is about one-fourth the height.
        // The other sprite (Ball) should change angle if:
        // 1. it hits the middle horizontal third of the image, which is not blank, AND
        // 2. it hits the upper fourth, which is Ann's head.
        let horizontalOffset = this.x - otherSprite.x;
        let verticalOffset = this.y - otherSprite.y;
        if (Math.abs(horizontalOffset) < this.width / 3 &&
            verticalOffset > this.height / 4) {
            // The new angle depends on the horizontal difference between sprites.
            otherSprite.angle = 90 + 2 * horizontalOffset;
        }
        return false;
    }

    handleFirstGameLoop() {
        // Set up a text area to display the number of lives remaining.
        this.livesDisplay = game.createTextArea(game.displayWidth - 144, 20);
        this.updateLivesDisplay();
    }

    updateLivesDisplay() {
        game.writeToTextArea(this.livesDisplay, "Lives = " + this.lives);
    }

    loseALife() {
        this.lives = this.lives - 1;
        this.updateLivesDisplay();
        if (this.lives > 0) {
            new Ball;
        }
        else {
            game.end('The mysterious stranger\nhas escaped Princess Ann' +
                '\n...for now!\nBetter luck next time.');
        }
    }

    addALife() {
        this.lives = this.lives + 1;
        this.updateLivesDisplay();
    }
}

let ann = new Princess;

//Creates Ball
class Ball extends Sprite {

    constructor() {
        super();
        this.x = game.displayWidth / 2;
        this.y = game.displayHeight / 2;
        this.height = 48;
        this.width = 48;
        this.name = "Ball";
        this.setImage("ball.png");
        this.defineAnimation("spin", 0, 12);
        this.playAnimation("spin", true);
        this.speed = 1;
        this.angle = 50 + Math.random() * 80;
        Ball.ballsInPlay = Ball.ballsInPlay + 1;
    }

    handleGameLoop() {
        if (this.speed <= 200)
            this.speed += 2;
    }

    handleBoundaryContact() {
        game.removeSprite(this);
        //ann.loseALife();
        Ball.ballsInPlay = Ball.ballsInPlay - 1;
        if (Ball.ballsInPlay == 0) {
            ann.loseALife();
        }
    }
}

Ball.ballsInPlay = 0;

let ball = new Ball();

// Creates Blocks
class Block extends Sprite {

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.name = "Block";
        this.setImage("block1.png");
        this.accelerateOnBounce = false;
        Block.blocksToDestroy = Block.blocksToDestroy + 1;
    }

    handleCollision() {
        game.removeSprite(this);
        Block.blocksToDestroy = Block.blocksToDestroy - 1;
        if (Block.blocksToDestroy <= 0) {
            game.end('Congratulations!\n\nPrincess Ann can continue ' +
                'her pursuit\nof the mysterious stranger!');
            this.true;
        }
    }
}

Block.blocksToDestroy = 0;

class ExtraLifeBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.setImage("block2.png");
        Block.blocksToDestroy = Block.blocksToDestroy - 1;
    }

    handleCollision() {
        ann.addALife();
        return true;
    }

}

new ExtraLifeBlock(200, 250);

class ExtraBallBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.setImage("block3.png");
    }

    handleCollision() {
        super.handleCollision();
        new Ball();
        return true;
    }
}

new ExtraBallBlock(600, 250);

class LoseLifeBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.setImage("block4.png");
        Block.blocksToDestroy = Block.blocksToDestroy - 1;
    }

    handleCollision() {
        ann.loseALife();
        return true;
    }

}

new LoseLifeBlock(600, 350);

class QuadBallBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.setImage("block5.png");
    }

    handleCollision() {
        super.handleCollision();
        new Ball();
        new Ball();
        new Ball();
        new Ball();
        return true;
    }
}

new QuadBallBlock(200, 350);

for (let i = 0; i < 15; i = i + 1) {
    new Block(65 + i * 48, 200);
}

for (let i = 0; i < 15; i = i + 1) {
    new Block(95 + i * 48, 300);
}

for (let i = 0; i < 15; i = i + 1) {
    new Block(95 + i * 48, 400);
}
