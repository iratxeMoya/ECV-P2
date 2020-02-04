/*var canvas = document.getElementById('canvas');
var img = new Image();
img.src = "data/sprites.png";

canvas.addEventListener('click', onClick)
var ctx = canvas.getContext('2d'),
    x, y, x1, y1, x2 = 100, y2 = 100, /// positions
    f = 0,                        /// "progress"
    speed,                        /// speed based on dist/steps
    dist,                         /// distance between points
    steps = 5;                    /// steps (constant speed)
loop();
function onClick (e) {
    f = 0;
    /// if we are moving, return
    if (f !== 0) return;

    /// set start point
    x1 = x2;
    y1 = y2;

    /// get and adjust mouse position    
    var rect = canvas.getBoundingClientRect();
    x2 = e.clientX - rect.left,
    y2 = e.clientY - rect.top;

    /// calc distance
    var dx = x2 - x1,
        dy = y2 - y1;

    dist = Math.abs(Math.sqrt(dx * dx + dy * dy));

    /// speed will be number of steps / distance
    speed = steps / dist;

    /// move player
    loop();
}

function loop() {

    /// clear current drawn player
    ctx.clearRect(0, 0, 900, 900);

    /// move a step
    f += speed;

    /// calc current x/y position
    x = x1 + (x2 - x1) * f;
    y = y1 + (y2 - y1) * f;

    /// at goal? if not, loop
    if (f < 1) {
        /// draw the "player"
        ctx.drawImage( img, x, y);

        requestAnimationFrame(loop);
    } else {
        
        /// draw the "player"
        ctx.drawImage( img, x, y);
        console.log('hey', ctx);
        /// reset f so we can click again
        f = 0;
    }
}*/


var tilemap = "data/tiles.png";
var spritesheet = "data/sprites.png";


var img = new Image();
img.src = "data/sprites.png";

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var h, w, speed = 10;

cvs.addEventListener('click', onClick);

var cx = 900 / 2; //posicion original
var cy = 900 / 2;
var nx = cx; //posicion al que movernos
var ny = cy;

function onClick (event) {
    nx = event.clientX, ny = event.clientY;
};
function draw() {
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 900, 900);

    /*if(nx - cx > 0) {
        cx += speed;
    }else if (nx - cx < 0) {
        cx -= speed;
    }
    if (ny - cy > 0) {
        cy += speed;
    } else if (ny - cy < 0) {
        cy -= speed;
    }*/
    cx += (nx - cx) / speed;
    cy += (ny - cy) / speed;

    

    ctx.drawImage(img, 0, 0,50,50,10,10,50,50);

    ctx.restore();
};

function loop () {
    draw();
    requestAnimationFrame( loop );
}
loop();