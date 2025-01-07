// Welcome to Robert Cunningham's Pinball Project

const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

class Scoreboard {
    constructor(){
        this.score = 0
        this.nickname = "test user 1"
        this.userID = 0
        this.balls = 50
    }

    display(){
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        let score_string = "Score: " + this.score.toString();
        ctx.fillText(score_string, 300, 580);

        let balls_string = "Balls: " + this.balls.toString();
        ctx.fillText(balls_string, 300, 540);
    }
}

class Ball{
    constructor(x_pos, y_pos, color, spring, damping, radius){
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.color = color;
        this.spring = spring; // fraction of velocity gained during a paddle wack
        this.damping = damping; // fraction of velocity lost during a bounce
        this.radius = radius;
        this.velocityX = 0; //pixels per frame
        this.velocityY = 0; //pixels per frame
        this.gravity = 0.1;

        this.start_x_pos = x_pos;
        this.start_y_pos = y_pos;
        this.start_color = color;
        this.start_spring = spring; // fraction of velocity gained during a paddle wack
        this.start_damping = damping; // fraction of velocity lost during a bounce
        this.start_radius = radius;
        this.start_velocityX = 0; //pixels per frame
        this.start_velocityY = 0; //pixels per frame
        this.last_gravity = 0.1;
    }

    // GameContext uses this method to match the ball gravity to the game gravity
    setGravity(gravity){
        this.gravity = gravity;
        this.last_gravity = gravity;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x_pos, this.y_pos, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(){
        // apply gravity
        this.velocityY = this.velocityY + this.gravity

        // apply position change
        this.y_pos += this.velocityY
        this.x_pos = this.x_pos + this.velocityX 
    }

    reset(){
        this.x_pos = this.start_x_pos;
        this.y_pos = this.start_y_pos;
        this.color = this.start_color;
        this.spring = this.start_spring; // fraction of velocity gained during a paddle wack
        this.damping = this.start_damping; // fraction of velocity lost during a bounce
        this.radius = this.start_radius;
        this.velocityX = 0; //pixels per frame
        this.velocityY = 0; //pixels per frame
        this.gravity = this.last_gravity;
    }
}


// Left Paddle
class leftPaddle{
    constructor(){
        this.width = 150
        this.height = 20
        this.motion_direction = 1 // 1 for clockwise, -1 for clockwise
        this.acceleration = 10  // increase in pixels moved per frame per frame
        this.x_pos = 100
        this.y_pos = canvas.height + 5 // have it start off screen
        this.color = "yellow"
        this.velocity = 1
        this.angle = 0 // rotation angle in degrees
        this.rad = this.angle * Math.PI / 180; // rotation angle in rads
        this.angular_velocity = 10 * this.motion_direction;
        this.max_angle = 90;
        this.min_angle = 0;
        this.max_height = canvas.height + 5 // higher "height" is lower on the screen
        this.min_height = canvas.height - (this.height * 2)
    }

    setWidth(width){
        this.width = width;
    }

    setHeight(height){
        this.height = height;
    }

    setAcceleration(acceleration){
        this.acceleration = acceleration;
    }

    setX_Pos(x_pos){
        this.x_pos = x_pos;

    }
    setY_Pos(y_pos){
        this.y_pos = y_pos;
    }

    setGravity(gravity){
        this.gravity = gravity;
    }

    setAngularAcceleration(angular_velocity){
        this.angular_velocity = angular_velocity
    }

    getRotatedPaddleCorners() {
        // Get center point
        let cx = this.x_pos + this.width/2;
        let cy = this.y_pos + this.height/2;
        
        // Get corners relative to center
        let points = [
            {x: -this.width/2, y: -this.height/2},
            {x: this.width/2, y: -this.height/2},
            {x: this.width/2, y: this.height/2},
            {x: -this.width/2, y: this.height/2}
        ];
        
        // Rotate and translate points
        return points.map(p => {
            let x = p.x * Math.cos(this.rad) - p.y * Math.sin(this.rad) + cx;
            let y = p.x * Math.sin(this.rad) + p.y * Math.cos(this.rad) + cy;
            return {x, y};
        });
    }

    draw(){

        ctx.save()

        //Convert degrees to radian 
        //var this.rad = deg * Math.PI / 180;
    
        //Set the origin to the center of the image
        ctx.translate(this.x_pos + this.width / 2, this.y_pos + this.height / 2);
    
        //Rotate the canvas around the origin
        ctx.rotate(this.rad);
    
        //draw the image    
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.closePath();

        // Restore canvas state as saved from above
        ctx.restore();
    }

    update(){
        // if left is pressed, make it rise and turn
        if (left_pressed && this.y_pos >= this.min_height && this.angle <= this.max_angle){ // if left is pressed and it's less than two lengths from the bottom
            this.velocity = this.velocity + this.acceleration
            this.y_pos = this.y_pos - this.velocity
            this.angle += this.angular_velocity
            this.rad = this.angle * Math.PI / 180;
        }

        // if left is not pressed, and it's not fallen to its minimum height let it fall and turn
        else if (!left_pressed && this.y_pos <= this.max_height){
            // set velocity to 0 in the keyup event listener
            this.velocity = this.velocity + this.gravity
            this.y_pos = this.y_pos + this.velocity
            // if the paddle isn't lying flat yet, let it rotate more
            if (this.angle >= this.min_angle){
                this.angle -= this.angular_velocity
                this.rad = this.angle * Math.PI / 180;
            }
        }
    }
}


// Right Paddle
// 1. Move location of paddle to the right
// 2. Reverse angle range? (current range is 0-90) (does direction of motion need to change?)
// 3. leftpressed becomes right pressed
class rightPaddle{
    constructor(){
        this.width = 150
        this.height = 20
        this.motion_direction = -1 // 1 for clockwise, -1 for clockwise
        this.acceleration = 10 // increase in pixels moved per frame per frame
        this.x_pos = 400
        this.y_pos = canvas.height + 5 // have it start off screen
        this.color = "yellow"
        this.velocity = 1
        this.angle = 180 // rotation angle in degrees
        this.rad = this.angle * Math.PI / 180; // rotation angle in rads
        this.angular_velocity = 10 * this.motion_direction;
        this.max_angle = 180;
        this.min_angle = 90;
        this.max_height = canvas.height + 5 // higher "height" is lower on the screen
        this.min_height = canvas.height - (this.height * 2)
    }

    setWidth(width){
        this.width = width;
    }

    setHeight(height){
        this.height = height;
    }

    setAcceleration(acceleration){
        this.acceleration = acceleration;
    }

    setX_Pos(x_pos){
        this.x_pos = x_pos;

    }
    setY_Pos(y_pos){
        this.y_pos = y_pos;
    }

    setGravity(gravity){
        this.gravity = gravity;
    }

    setAngularAcceleration(angular_velocity){
        this.angular_velocity = angular_velocity
    }

    getRotatedPaddleCorners() {
        // Get center point
        let cx = this.x_pos + this.width/2;
        let cy = this.y_pos + this.height/2;
        
        // Get corners relative to center
        let points = [
            {x: -this.width/2, y: -this.height/2},
            {x: this.width/2, y: -this.height/2},
            {x: this.width/2, y: this.height/2},
            {x: -this.width/2, y: this.height/2}
        ];
        
        // Rotate and translate points
        return points.map(p => {
            let x = p.x * Math.cos(this.rad) - p.y * Math.sin(this.rad) + cx;
            let y = p.x * Math.sin(this.rad) + p.y * Math.cos(this.rad) + cy;
            return {x, y};
        });
    }

    draw(){

        ctx.save()

        //Convert degrees to radian 
        //var this.rad = deg * Math.PI / 180;
    
        //Set the origin to the center of the image
        ctx.translate(this.x_pos + this.width / 2, this.y_pos + this.height / 2);
    
        //Rotate the canvas around the origin
        ctx.rotate(this.rad);
    
        //draw the image    
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.closePath();

        // Restore canvas state as saved from above
        ctx.restore();
    }

    update(){
        // event: paddle rises when you press right
        // height: and is below its max height
        // angle: for the right paddle, we want the paddle be over 90 degrees
        if (right_pressed && this.y_pos >= this.min_height && this.angle >= this.min_angle){ 
            this.velocity = this.velocity + this.acceleration
            this.y_pos = this.y_pos - this.velocity
            this.angle += this.angular_velocity // angular velocity is negative, so add it
            this.rad = this.angle * Math.PI / 180;
        }

        else if (!right_pressed && this.y_pos <= this.max_height){
            // set velocity to 0 in the keyup event listener
            this.velocity = this.velocity + this.gravity
            this.y_pos = this.y_pos + this.velocity
            // if the paddle isn't lying flat yet, let it rotate more
            if (this.angle <= this.max_angle){
                this.angle -= this.angular_velocity
                this.rad = this.angle * Math.PI / 180;
            }
        }
    }
}


class Bullseye{
    constructor(x_pos, y_pos, radius, point_value){
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.radius = radius;
        this.point_value = point_value;
        this.color = "green";
        this.struck = false;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x_pos, this.y_pos, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(){
        if (this.struck === true){
            
            setTimeout( () => this.color = 'red', 200)
            setTimeout( () => this.color = 'green', 400)
            setTimeout( () => this.color = 'red', 600)
            setTimeout( () => this.color = 'green', 800)
            setTimeout( () => this.color = 'red', 1000)
            setTimeout( () => this.color = 'green', 1200)
            this.struck = false;
        }

    }
}

class GameInstance{
    constructor(gravity, fps, ball_x_pos, ball_y_pos, ball_color, ball_spring, ball_damping, ball_radius){
        this.gravity = gravity;
        this.fps = 60;
        this.frame_duration = 1000 / fps;
        this.ball = new Ball(ball_x_pos,ball_y_pos,ball_color, ball_spring , ball_damping, ball_radius); // Ball constructor(x_pos, y_pos, color, spring, damping)
        this.left_paddle = new leftPaddle();
        this.right_paddle = new rightPaddle();
        this.bullseyes = [new Bullseye(350, 400, 40, 100)];
        this.left_paddle.setGravity(this.gravity);
        this.right_paddle.setGravity(this.gravity);
        this.ball.setGravity(this.gravity);  // set the ball's gravity
        this.balls_remaining = 5;
        this.scoreboard = new Scoreboard();
    }

    detect_collisions(){
        // if the left edge of the ball touches the left edge of the screen
        if (this.ball.x_pos - this.ball.radius <= 0){
            this.ball.x_pos = this.ball.radius;
            this.ball.velocityX = -this.ball.velocityX * (1 - this.ball.damping)
        }

        // if the right edge of the ball touches the right edge of the screen
        if (this.ball.x_pos + this.ball.radius >= canvas.width){
            this.ball.x_pos = canvas.width - this.ball.radius;
            this.ball.velocityX = -this.ball.velocityX * (1 - this.ball.damping)
        }

        // if the bottom of the ball hits the bottom of the screen
        if (this.ball.y_pos + this.ball.radius >= canvas.height){
            
            this.ball.y_pos = canvas.height - this.ball.radius;
            // this.ball.velocityY = -this.ball.velocityY * (1 - this.ball.damping)

            this.balls_remaining -= 1 // lose a ball_remaining

            // move the ball back to starting position
            this.ball.y_pos = this.ball.radius * 2
            this.ball.x_pos = canvas. width / 2

            this.scoreboard.balls -= 1;
            this.ball.reset();
        }

        // if the top of the ball hits the top of the screen
        if (this.ball.y_pos - this.ball.radius <= 0){
            this.ball.y_pos = this.ball.radius;
            this.ball.velocityY = -this.ball.velocityY * (1 - this.ball.damping)
        }

        //if the ball hits the left paddle
        //function shapesIntersect(rectPoints, circleCenter, radius)
        //update the corners of the paddle


        if (shapesIntersect(this.left_paddle.getRotatedPaddleCorners(), {x: this.ball.x_pos, y: this.ball.y_pos}, this.ball.radius)){
            console.log("collision detected with left paddle and ball")
            // 1) Compute the paddle’s surface normal
            let normalAngle = this.left_paddle.rad - Math.PI/2;
            let Nx = Math.cos(normalAngle);
            let Ny = Math.sin(normalAngle);

            // 2) Get ball's current velocity
            let vx = this.ball.velocityX;
            let vy = this.ball.velocityY;

            // 3) Compute dot product (v dot N)
            // Make sure (Nx, Ny) is already normalized (cos/sin is unit length).
            let dot = vx * Nx + vy * Ny;  

            // 4) Reflect velocity: v' = v - 2*(v·N)*N
            // This is the standard reflection about a line/plane with normal N.
            let rx = vx - 2 * dot * Nx;
            let ry = vy - 2 * dot * Ny;

            // 5) Optionally apply damping or scale
            // Example: keep speed but reduce by some damping factor
            let dampingFactor = (1 - this.ball.damping);  // or .9, or any factor you like
            rx *= dampingFactor;
            ry *= dampingFactor;

            // 6) Assign the new velocity back to the ball
            this.ball.velocityX = rx;
            this.ball.velocityY = ry;
        }

        // if the ball strikes the right paddle
        if (shapesIntersect(this.right_paddle.getRotatedPaddleCorners(), {x: this.ball.x_pos, y: this.ball.y_pos}, this.ball.radius)){
            console.log("collision detected with right paddle and ball")
            // 1) Compute the paddle’s surface normal
            let normalAngle = this.right_paddle.rad - Math.PI/2;
            let Nx = Math.cos(normalAngle);
            let Ny = Math.sin(normalAngle);

            // 2) Get ball's current velocity
            let vx = this.ball.velocityX;
            let vy = this.ball.velocityY;

            // 3) Compute dot product (v dot N)
            // Make sure (Nx, Ny) is already normalized (cos/sin is unit length).
            let dot = vx * Nx + vy * Ny;  

            // 4) Reflect velocity: v' = v - 2*(v·N)*N
            // This is the standard reflection about a line/plane with normal N.
            let rx = vx - 2 * dot * Nx;
            let ry = vy - 2 * dot * Ny;

            // 5) Optionally apply damping or scale
            // Example: keep speed but reduce by some damping factor
            let dampingFactor = (1 - this.ball.damping);  // or .9, or any factor you like
            rx *= dampingFactor;
            ry *= dampingFactor;

            // 6) Assign the new velocity back to the ball
            this.ball.velocityX = rx;
            this.ball.velocityY = ry;
        }

        // if the ball hits the bullseye
        for (let bullseye of this.bullseyes){
            let ball_center = {x: this.ball.x_pos, y: this.ball.y_pos}
            let bullseye_center = {x: bullseye.x_pos, y: bullseye.y_pos }
            if (circlesIntersect(ball_center, this.ball.radius, bullseye_center, bullseye.radius)){
                // reverse the direction of velocity, apply damping factor
                this.ball.velocityX = -this.ball.velocityX * this.ball.spring
                this.ball.velocityY = -this.ball.velocityY * this.ball.spring 
                
                // add the score, set "stuck" to true to trigger animation
                this.scoreboard.score += bullseye.point_value
                bullseye.struck = true;
                
            }
        }
    }

    addBullseye(x_pos, y_pos, radius, point_value){
        this.bullseyes.push(new Bullseye(x_pos, y_pos, radius, point_value));
    }

    // GameInstance.Draw is the game loop
    draw(){
        // clear the screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw the objects
        this.ball.draw();
        this.left_paddle.draw();
        this.right_paddle.draw();
        for (let bullseye of this.bullseyes){
            bullseye.draw();
        }
        this.scoreboard.display();

        // detect collisions
        this.detect_collisions();

        //
        this.ball.update();
        this.left_paddle.update();
        this.right_paddle.update();
        for (let bullseye of this.bullseyes){
            bullseye.update();
        }
        //this.scoreboard.update();
        
        requestAnimationFrame(this.draw.bind(this));
    }
}

var left_pressed = false
var right_pressed = false

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)

function keyDownHandler(e){
    if (e.key === 'Right' || e.key === 'ArrowRight'){
        right_pressed = true;
    }

    else if (e.key === 'Left' || e.key ==='ArrowLeft'){
        left_pressed = true;
    }
}

function keyUpHandler(e){
    if (e.key === 'Right' || e.key === 'ArrowRight'){
        right_pressed = false;
        game.right_paddle.velocity = 0;
    }

    else if (e.key === 'Left' || e.key === 'ArrowLeft'){
        left_pressed = false;
        game.left_paddle.velocity = 0;
    }
}

//constructor(gravity, fps, ball_x_pos, ball_y_pos, ball_color, ball_spring, ball_damping, ball_radius){
game = new GameInstance(0.3, 60, 200 ,100,"blue", 1.3 , 0.01, 10) // new game with gravity 3 and 60 fps
game.addBullseye(30, 450, 20, 200)
game.draw();


// copied from stack overflow 
function drawImageRot(img,x,y,width,height,deg){
    // Store the current context state (i.e. rotation, translation etc..)
    ctx.save()

    //Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);

    // Restore canvas state as saved from above
    ctx.restore();
}


///
///
///
///

function circlesIntersect(circleCenter_1, radius_1, circleCenter_2, radius_2){
    let a_squared = ((circleCenter_1.x) - (circleCenter_2.x)) ** 2
    let b_squared = ((circleCenter_1.y) - (circleCenter_2.y)) ** 2
    let c_squared = a_squared + b_squared
    let radial_distance = Math.sqrt(c_squared)

    let collision_threshold = radius_1 + radius_2

    if (radial_distance <= collision_threshold){
        return true
    }
    else {
        return false
    }
}

// INTERSECTION ALGORITHMS GENERATED BY CHATGPT, NEEDS TESTING BEFORE SHIPPING, BEWARE
// check if circle and square overlap
function shapesIntersect(rectPoints, circleCenter, radius) {
    const [p1, p2, p3, p4] = rectPoints;
    const { x: cx, y: cy } = circleCenter;

    // Helper function: Distance between two points
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    // Helper function: Check if a point is inside the rectangle
    function pointInRectangle(point, rectPoints) {
        const [p1, p2, p3, p4] = rectPoints;

        // Compute vectors
        const v0 = { x: p4.x - p1.x, y: p4.y - p1.y };
        const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
        const v2 = { x: point.x - p1.x, y: point.y - p1.y };

        // Compute dot products
        const dot00 = v0.x * v0.x + v0.y * v0.y;
        const dot01 = v0.x * v1.x + v0.y * v1.y;
        const dot02 = v0.x * v2.x + v0.y * v2.y;
        const dot11 = v1.x * v1.x + v1.y * v1.y;
        const dot12 = v1.x * v2.x + v1.y * v2.y;

        // Compute barycentric coordinates
        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        // Check if point is in rectangle
        return u >= 0 && v >= 0 && u + v <= 1;
    }

    // Helper function: Check if a circle intersects a line segment
    function lineIntersectsCircle(x1, y1, x2, y2, cx, cy, r) {
        // Line segment vector
        const dx = x2 - x1;
        const dy = y2 - y1;

        // Vector from circle center to line start
        const fx = x1 - cx;
        const fy = y1 - cy;

        // Quadratic coefficients
        const a = dx * dx + dy * dy;
        const b = 2 * (fx * dx + fy * dy);
        const c = fx * fx + fy * fy - r * r;

        // Discriminant
        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) {
            // No intersection
            return false;
        }

        // Check for intersection within segment bounds
        const sqrtD = Math.sqrt(discriminant);
        const t1 = (-b - sqrtD) / (2 * a);
        const t2 = (-b + sqrtD) / (2 * a);

        return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
    }

    // Check if circle's center is inside the rectangle
    if (pointInRectangle(circleCenter, rectPoints)) {
        return true;
    }

    // Check if any rectangle edge intersects the circle
    const edges = [
        [p1, p2],
        [p2, p3],
        [p3, p4],
        [p4, p1]
    ];

    for (const [start, end] of edges) {
        if (lineIntersectsCircle(start.x, start.y, end.x, end.y, cx, cy, radius)) {
            return true;
        }
    }

    // No intersection found
    return false;
}
