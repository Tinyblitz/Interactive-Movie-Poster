// Check Readme File

var poster;

var timeTracker;
var timeCounter = 0;

var hasStarted = false;


// Image Variables

var mario = [];
var marioWords = [];

var toad = [];
var toadWords = [];
var goodMush;
var badMush;

var bowser = [];
var bowserWords = [];

var block;
var pipe_top;
var pipe_bot;

var pipeHeight, pipeWidth;
var pipeH3D;

var blockHeight;
var blockH3D;


// Sound Variables

var pipeSound;
var jumpSound;
var landingSound;

var marioSound;
var marioTalk;

var toadSound;
var toadOffer;
var toadTalk;

var kamekSound;
var bowserRoar;
var bowserLand;
var bowserTalk;

// Player Variables
var player;
var init_x_pos, init_y_pos;
var cast = ['Mario', 'toad', 'Bowser'];
var charAlive = false;
var charIsEntering = false;
var charIsLeaving = false;
var charIsJumpingUp = false;
var charIsJumpingDown = false;
var chosenChar = '';
var jumpDist = 50;
var gravity = 0.1;

// Other Variables

// For Speech
var said = '';

// For Toad's interaction
var mushroomAlive = false;

function preload(){
  
  // IMAGES
  
  // Mario
  for (let i = 0; i < 20; i++){
    mario[i] = loadImage('Images/Characters/MariO/mario' + nf(i) + '.png');
  }
  
  // Toad
  for (let i = 0; i < 8; i++){
    toad[i] = loadImage('Images/Characters/Toad/toad' + nf(i) + '.png');
  }
  
  // Bowser
  for (let i = 0; i < 9; i++){
    bowser[i] = loadImage('Images/Characters/Bowser/bowser' + nf(i) + '.png');
  }
  
  goodMush = loadImage('Images/Characters/Toad/goodMush.png');
  badMush = loadImage('Images/Characters/Toad/badMush.png');
  
  block = loadImage('Images/Background/MarioBlock.png');
  pipe_bot = loadImage('Images/Background/pipe_bot.png');
  pipe_top = loadImage('Images/Background/pipe_top.png');
  
  
  // SOUNDS
  
  pipeSound = loadSound('Sounds/PIPE.mp3');
  jumpSound = loadSound('Sounds/JUMP.mp3');
  landingSound = loadSound('Sounds/lanDIng.mp3');
  
  marioSound = loadSound('Sounds/MariO/ITSAME.mp3');
  marioTalk = createAudio('Sounds/MariO/Mariotalk.mp3');
  
  toadSound = loadSound('Sounds/Toad/toadHello.mp3');
  toadOffer = loadSound('Sounds/Toad/toadOffer.mp3');
  toadTalk = createAudio('Sounds/Toad/donttouch.mp3');
  
  kamekSound = loadSound('Sounds/Bowser/behold.mp3');
  bowserRoar = loadSound('Sounds/Bowser/roar.mp3');
  bowserLand = loadSound('Sounds/Bowser/bowLand.mp3');
  bowserTalk = createAudio('Sounds/Bowser/bowsertalk.mp3');
  
  // SPEECH
  // Create a Speech Recognition object with callback
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  // "Continuous recognition" (as opposed to one time only)
  let continuous = true;
  // If you want to try partial recognition (faster, less accurate)
  let interimResults = true;
  // This must come after setting the properties
  speechRec.start(continuous, interimResults);


  // Speech recognized event
  function gotSpeech() {
    //console.log(speechRec);
    if (speechRec.resultValue) said = speechRec.resultString;
  }
}

function setup() {
  createCanvas(513, 760);
  
  // create a 3d off-screen surface
  img3d = createGraphics(513,760,WEBGL);
  img3d.imageMode(CENTER);
  
  timeTracker = second();
  
  textAlign(CENTER, TOP);
  textFont('Georgia');
  
  pipeHeight = height - 4*pipe_bot.height/5;
  pipeWidth = width/2 - pipe_bot.width/2;
  
  blockHeight = height - 331/2;
  
  // 3D elements
  pipeH3D = height/2 - 3*pipe_bot.height/10;
  blockH3D = height/2 - 331/4;
  
  //init_x_pos = pipeWidth + pipeWidth/4;
  //init_y_pos = pipeHeight + pipeHeight/4;
  
  init_x_pos = 0;
  init_y_pos = pipeH3D + pipeH3D/4;
  
  marioTalk.onended(endAudio);
  toadTalk.onended(endAudio);
  bowserTalk.onended(endAudio);
}

function draw() {
  
  // Start screen to let everything load.
  // User must also click on the screen to activate the speech input
  if (!hasStarted){
    background(0);
    
    let alph = 255;
    let mouseOnButton = false;
    
    // Define parameters for starting using mouse
    if (mouseX >= width/2 - 70 && 
        mouseX <= width/2 + 70 &&
        mouseY >= height/2 - 35 &&
        mouseY <= height/2 + 35){
        mouseOnButton = true;  
    }
    else mouseOnButton = false;
    
    if (mouseOnButton){
      alph = 200;
      if (mouseIsPressed) hasStarted = true;
    }
    
    // Display Start button
    push();
    strokeWeight(2.5);
    stroke(0,255,0,alph);
    fill(255,0,0, alph);
    ellipse(width/2, height/2, 160, 100);
    
    strokeWeight(5);
    stroke(0,0,0,alph);
    fill(0,255,0,alph);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Start", width/2, height/2);
    
    pop();
    
    push();
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    
    // Display Premise
    text("The Interactive Movie Poster is one where you can chat\nwith the cast to learn more about the characters. It uses\nvoice recognition to capture keywords and phrases that\ninitiates a fixed reaction from the characters.  Dialogue\ncan be new or from trailers or other promotional media.\nDeveloped for the upcoming Super Mario Bros. movie.", width/9, height/7);
    
    // Display Instructions
    text("Commands\n\nSay [Character name] --> Character Enters\n\n Say 'Bye' --> Character Leaves\n\nFor Mario, say 'It's a me'\n\nFor Toad, say 'Mushrooms'\n\nFor Bowser, say 'Do you yield'", width/9, 2*height/3);
    
    pop();
    
    // Prevent speech being picked up before user is on the poster screen
    said = null;
    return;
  }
  
  backGradient();
  
  fill(255);
  textSize(40);
  textStyle(BOLDITALIC);
  text("Meet the Cast",width/2, 20);
  
  textSize(13);
  textStyle(NORMAL);
  text("jack \n BLACK \n as \n BOWSER", width/4, 80);
  text("chris \n PRATT \n as \n MARIO", width/2, 80);
  text("keegan-michael \n KEY \n as \n TOAD", 3*width/4, 80);
  
  if (!charAlive){
    let castT = -1;
    for (let i = 0; i < cast.length; i++){
      
      if (said == cast[i]){
        chosenChar = said;
        charAlive = true;
        charIsEntering = true;
        charIsLeaving = false;
        
        castT = i;
        break;
      }
    }
    if (castT != -1){
      switch (cast[castT]){
        case 'Mario':
          player = new Player(init_x_pos, init_y_pos, mario, marioWords);
          break;
        case 'toad':
          player = new Player(init_x_pos, init_y_pos, toad, toadWords);
          break;
        case 'Bowser':
          player = new Player(init_x_pos, init_y_pos, bowser, bowserWords);
          break;
      }
    }
  }
  
  image(pipe_top, width/2 - pipe_bot.width/2, pipeHeight);
  if (!charIsEntering && !charIsLeaving) {
    image(pipe_bot, pipeWidth, pipeHeight);
  }
  
  switch(chosenChar){
    case 'Mario':
      
      if (charIsEntering){
        
        if (player.y_pos >= pipeH3D && !pipeSound.isPlaying()) pipeSound.play();
        
        EnteringScene(player);
        
      }
      else player.update();
      player.display();
      
      if (player.picTracker == 3) {
        
        if (timeCount(true) > 3) {
          player.startRotate(player.picTracker);
          timeCount(false);
        }
      }
      
      if (said == "bye"){
        
        player.isTalking = false;
        LeavingScene(player);
          
        marioTalk.stop();
          
        timeCount(false);
        break;
      }
      if (said == "it's a me"){
        marioTalk.play();
        
        if (!player.isTalking){
          player.isTalking = true;
          player.startRotate(4);
        }
      }
      
      // Chris Pratt's talk
      if (player.isTalking){
        let tCount = timeCount(true)
        if (tCount == 10 && !player.isRotating && player.picTracker == 5) {
          player.startRotate(player.picTracker);
        }
        else if (tCount == 14 && !player.isRotating && player.picTracker == 6){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 18 && !player.isRotating && player.picTracker == 7){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 20 && !player.isRotating && player.picTracker == 8){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 24 && !player.isRotating && player.picTracker == 9){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 25 && !player.isRotating && player.picTracker == 10){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 28 && !player.isRotating && player.picTracker == 11){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 30 && !player.isRotating && player.picTracker == 12){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 41 && !player.isRotating && player.picTracker == 13){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 45 && !player.isRotating && player.picTracker == 14){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 48 && !player.isRotating && player.picTracker == 15){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 52 && !player.isRotating && player.picTracker == 16){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 54 && !player.isRotating && player.picTracker == 17){
          player.startRotate(player.picTracker);
        }
        else if (tCount == 57 && !player.isRotating && player.picTracker == 18){
          player.startRotate(player.picTracker);
        }
      }
      
      break;
    case 'toad':
      
      if (charIsEntering){
        
        if (player.y_pos >= pipeH3D && !pipeSound.isPlaying()) pipeSound.play();
        
        EnteringScene(player);
        
      }
      else player.update();
      player.display();
      
      if (player.picTracker == 3) {
        
        if (timeCount(true) > 3) {
          player.startRotate(player.picTracker);
          timeCount(false);
        }
      }
      
      if (said == "bye"){
        
        player.isTalking = false;
        LeavingScene(player);
          
        toadTalk.stop();
          
        timeCount(false);
        break;
      }
      
      if (said == "mushrooms" && !mushroomAlive) {
        mushroomAlive = true;
        toadOffer.play();
        player.startRotate(4);
      }
      
      if (mushroomAlive){

        image(goodMush,width/2 - 1.5*goodMush.width, blockHeight - goodMush.height);
        
        let badX = width/2 + badMush.width/2;
        let badY = blockHeight - badMush.height;
        image(badMush, badX, badY);
        
        if (mouseX >= badX 
            && mouseX <= badX + badMush.width 
            && mouseY >= badY
            && mouseY <= badY + badMush.height
            && !player.isTalking) {
          player.isTalking = true;
          toadTalk.play();
          player.startRotate(5);
        }
      }
      
      // Michael's reach
      if (player.isTalking){
        let tCount = timeCount(true)
        if (tCount == 4 && !player.isRotating && player.picTracker == 6) {
          player.startRotate(player.picTracker);
        }
      }
      
      break;
    case 'Bowser':
      if (charIsEntering){
        if (player.y_pos >= pipeH3D && !pipeSound.isPlaying()) pipeSound.play();
        
        EnteringScene(player);
      }
      else player.update();
      player.display();
      
      if (player.picTracker == 3) {
        if (timeCount(true) > 3) {
          player.startRotate(player.picTracker);
          timeCount(false);
        }
      }
      
      if (said == "bye"){
        
        player.isTalking = false;
        LeavingScene(player);
          
        bowserTalk.stop();
          
        timeCount(false);
        break;
      }
      if (said == "do you yield"){
        bowserTalk.play();
        
        if (!player.isTalking){
          player.isTalking = true;
          player.startRotate(4);
        }
      }
      
      // Jack Black's Performance
      if (player.isTalking){
        let tCount = timeCount(true)
        if (tCount == 4 && !player.isRotating && player.picTracker == 5) {
          player.startRotate(player.picTracker);
        }
        else if (tCount == 6 && !player.isRotating && player.picTracker == 6) {
          player.startRotate(player.picTracker);
        }
        else if (tCount == 8 && !player.isRotating && player.picTracker == 7) {
          player.startRotate(player.picTracker);
        }
      }
      break;
  }
  
  // Allows for player to hide behind pipe when entering or leaving
  if (charIsEntering || charIsLeaving) {
    image(pipe_bot, pipeWidth, pipeHeight);
  }
  
  // For Testing
  //print(said);
  
  // Display block platform
  image(block, width/2 - 411/2, blockHeight, 411, 331/2);
  
}

// Produces gradient color background
function backGradient(){
  let c1 = color(100,0,0);
  let c2 = color(255,100,100);
  
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let newc = lerpColor(c1,c2,n);
    stroke(newc);
    line(0,y,width, y);
  }
}

function timeCount(x){
  if (!x) {timeCounter = 0; return 0;}

  if (timeTracker != second()){
    timeCounter++;
    timeTracker = second();
  }
  return timeCounter;
}

function endAudio(elt){
  player.picTracker = 4;
  player.isTalking = false;
  elt.stop();
  said = "";
  timeCount(false);
  mushroomAlive = false;
}

function Player (_x,_y,_castM,_castWords){
  
  this.x_pos = _x;
  this.y_pos = _y;
  
  this.movespeed = 3;
  
  this.pics = _castM;
  this.words = _castWords;
  
  this.picTracker = 0;
  
  this.targetLanding = blockH3D - 331/4 - this.pics[this.picTracker].height/2;
  
  this.isJumping = false;
  
  this.isRotating = false;
  this.rotateTarget = 0;
  this.rotateTracker = 0;
  this.rotD = 10;
  
  // Can Change
  this.rotSpeed = 2;
  // Cannot Change
  this.rSpeed = 0;
  
  this.isTalking = false;
  
  // Helpful function for rotation
  this.startRotate = function(picT) {
    this.isRotating = true;
    this.rotateTarget = picT;
  }
  
  // Switches image while rotating
  this.rotSwitch = function() {
    
    
    if (this.rotateTracker == 0) this.rSpeed = this.rotSpeed;
    else if (this.rotateTracker/ this.rotD == PI) this.rSpeed = -this.rotSpeed;
    
    this.rotateTracker += this.rSpeed;
    
    let rotAngle = this.rotateTracker/ this.rotD;
    
    if (this.rSpeed > 0) {
      if (rotAngle >= PI/2) this.picTracker = this.rotateTarget + 1;
      if (charIsLeaving){
        this.picTracker = this.rotateTarget - 1;
      }
    }
    else if (this.rSpeed < 0) {
      if (rotAngle <= PI/2) this.picTracker = this.rotateTarget + 1;
      if (charIsLeaving){
        this.picTracker = this.rotateTarget - 1;
      }
    }
    
    if (rotAngle <= 0) {
      this.rotateTracker = 0;
      this.rSpeed = 0;
      return false;
    }
    if (rotAngle >= PI) {
      this.rotateTracker = PI * this.rotD;
      this.rSpeed = 0;
      return false;
    }
    return true;
  }
  
  this.display = function() {

    // Draw to extra Canvas for animations
    img3d.clear();
    img3d.push();
    img3d.rotateY(this.rotateTracker/this.rotD);
    img3d.image(this.pics[this.picTracker], this.x_pos, this.y_pos);
    img3d.pop();
    
    image(img3d,0,0);
  }
    
  this.update = function() {
    
    if (this.isJumping){
      
      this.y_pos -= this.movespeed;
      this.movespeed -= gravity;
      
      if (this.movespeed < 0 && this.y_pos >= this.targetLanding){
        this.isJumping = false;
        this.y_pos = this.targetLanding;
        
        this.startRotate(this.picTracker);
        
        this.movespeed = 3;
        
        if (chosenChar == 'Bowser') bowserLand.play();
        else landingSound.play();
      }
    }
    else {
      
      if (this.picTracker == 2 && !this.isRotating) { 
        this.startRotate(this.picTracker);
        
        switch (chosenChar){
          case 'Mario':
            if (!marioSound.isPlaying()) marioSound.play();
            break;
          case 'toad':
            if (!toadSound.isPlaying()) toadSound.play();
            break;
          case 'Bowser':
            if (!bowserRoar.isPlaying()) bowserRoar.play();
            break;
        }
      }
      
      if (!charIsLeaving) this.y_pos = blockH3D - 331/4 - this.pics[this.picTracker].height/2;
    }
    if (this.isRotating){
      if (!this.rotSwitch()) this.isRotating = false;
    }
  }
}

function EnteringScene(mem){
  if (mem.y_pos <= pipeH3D - pipe_bot.height/2 - 3*mem.pics[0].height/10){
    mem.y_pos = pipeH3D - pipe_bot.height/2 - 3*mem.pics[0].height/10;
    if (timeCount(true) > 1){
      mem.startRotate(0);
      mem.isJumping = true;
      jumpSound.play();
      charIsEntering = false;
      timeCount(false);
    }
  }
  else mem.y_pos -= 3;
}

function LeavingScene(mem){
  
  //mem.picTracker = 0;
  if (charIsLeaving){
    if (mem.y_pos >= init_y_pos){
      player = null;
      charAlive = false;
      said = '';
      chosenChar = '';
    }
    else mem.y_pos += 3;
  }
  else if (!mem.isJumping){
    if (mem.y_pos == pipeH3D - pipe_bot.height/2 - 3*mem.pics[0].height/10){
      charIsLeaving = true;
      if (!pipeSound.isPlaying()) pipeSound.play();
    }
    else{
      mem.isJumping = true;
      jumpSound.play();
      mem.startRotate(0);
      mem.movespeed = 6.5;
      mem.targetLanding = pipeH3D - pipe_bot.height/2 - 3*mem.pics[0].height/10;
    }
  }
}