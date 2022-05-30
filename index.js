const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
    position: 'absolute',
    resolution: window.devicePixelRatio || 1
});
document.body.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

//constants
const IMG_MACHINE = "https://res.cloudinary.com/rmarcello/image/upload/v1431599260/slot-machine_fhrtsl.png";
const IMG_BUTTON = "./src/spin.idle.png";
const BET_BUTTON = "./src/bet.png";
const WINNER_IMAGE = "./src/winner.png";
const SOUND = PIXI.sound.Sound.from('./src/win.mp3');

const times = new PIXI.Text('x');
const basicText = new PIXI.Text(1);

let STATE_ZERO = 0;
let STATE_INIT = 1;
let STATE_MOVING = 2;
let STATE_CHECK_WIN = 3;

let SLOT_NUMBER = 5;
let INITIAL_X = 0;
let TILE_HEIGHT = 100;
let TILE_WIDTH = TILE_HEIGHT;
let N_CYCLE = 5;
let TOT_TILES = 7;

// /*
// * 0: fermo
// * 1: moving
// * 2: check win
// */
let gameStatus = 0;
let finalTileY = [];
let slotSprite = [];
let preChoosedPosition = [];

//setup
function setup() {
    times.x = 280;
    times.y = 350;
    container.addChild(times);

    basicText.x = 295;
    basicText.y = 350;
    container.addChild(basicText);

    texture = PIXI.Texture.from(IMG_BUTTON);
    buttonSprite = new PIXI.Sprite(texture);
    buttonSprite.x = 430;
    buttonSprite.y = 400;
    //Change the sprite's size
    buttonSprite.width = 100;
    buttonSprite.height = 100;
    container.addChild(buttonSprite);

    buttonSprite.interactive = true;
    buttonSprite.buttonMode = true;
    buttonSprite.click = function (e) {
        startAnimation();
    }

    buttonSprite.touchstart = function (e) {
        startAnimation();
    }

    texture = PIXI.Texture.from(BET_BUTTON);
    buttonSprite = new PIXI.Sprite(texture);
    buttonSprite.x = 30;
    buttonSprite.y = 400;
    //Change the sprite's size
    buttonSprite.width = 100;
    buttonSprite.height = 100;
    container.addChild(buttonSprite);

    buttonSprite.interactive = true;
    buttonSprite.buttonMode = true;
    buttonSprite.click = function (e) {
        changeBet();
    }

    buttonSprite.touchstart = function (e) {
        changeBet();
    }

    //tiles
    texture = PIXI.Texture.from(IMG_MACHINE);
    preChoosedPosition = [1, 2, 3, 4, 5];
    for(let i = 0; i < SLOT_NUMBER; i++) {
        slotSprite[i] = new PIXI.TilingSprite(texture, TILE_WIDTH, TILE_HEIGHT * 3 + 20);
        slotSprite[i].tilePosition.x = 0;
        slotSprite[i].tilePosition.y = (-preChoosedPosition[i] * TILE_HEIGHT) + 10;
        slotSprite[i].x = INITIAL_X + (i * 115);
        slotSprite[i].y = 0;
        container.addChild(slotSprite[i]);
    }

    draw();
}

function changeBet() {
    if(basicText.text <= 4) basicText.text++
    else basicText.text = 0;

}

function winner() {
    texture = PIXI.Texture.from(WINNER_IMAGE);
    winnerSprite = new PIXI.Sprite(texture);
    winnerSprite.x = 80;
    winnerSprite.y = 500;
    container.addChild(winnerSprite);
}
//
let INC = [15, 20, 25, 30, 35];
//
//functions draw
function draw() {
    if(gameStatus === STATE_ZERO) {
        gameStatus=STATE_INIT;
    } else if(gameStatus === STATE_INIT) {
        gameStatus = STATE_CHECK_WIN;
    } else if(gameStatus === STATE_MOVING) {
        for(let i = 0; i < SLOT_NUMBER; i++) {
            if(finalTileY[i] > 0) {
                slotSprite[i].tilePosition.y = slotSprite[i].tilePosition.y + INC[i];
                finalTileY[i] = finalTileY[i] - INC[i];
            }
        }
        if(finalTileY[0] - 5 <= 0) {
            gameStatus = STATE_CHECK_WIN;
        }
    } else if(gameStatus === STATE_CHECK_WIN) {
        let test = true;
        for(let i = 1; i < SLOT_NUMBER; i++) {
            if(preChoosedPosition[i] !== preChoosedPosition[i-1]) {
                test = false;
            }
        }
        if(test) {
            SOUND.play();
            winner();
        }
        return; //no more animation
    }
    app.render(container);
    requestAnimationFrame(draw);
}//draw

function startAnimation() {
    if(gameStatus === STATE_INIT || gameStatus === STATE_CHECK_WIN) {
        container.children.length = 9;
        preChoosedPosition = getRandomPositions();
        for(let i = 0; i < SLOT_NUMBER; i++) {
            slotSprite[i].tilePosition.y = (-preChoosedPosition[i] * TILE_HEIGHT) + 10;
            finalTileY[i] = (N_CYCLE * TILE_HEIGHT * TOT_TILES);
        }
        gameStatus = STATE_MOVING;
        draw();
    }
}

// /**
//  * Returns a random integer between min (inclusive) and max (inclusive)
//  * Using Math.round() will give you a non-uniform distribution!
//  */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPositions() {
    let x = getRandomInt(0, 100);
    if(x > 50) {
        x = getRandomInt(0,6);
        return [x, x, x, x, x];
    }
    return [getRandomInt(0,6),getRandomInt(0,6),getRandomInt(0,6), getRandomInt(0,6), getRandomInt(0,6)];
}

setup();

container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;