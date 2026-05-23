let handPose;
let video;
let hands = [];
let zoom = 1;
let modeloActual = 1;
let modelo1,modelo2,modelo3,modelo4,modelo5,modelo6;
let textura;
let fuente;
let camW = 200
let camH = 150
let escala = camW / 640
let rotX = 0;
let rotY = 0;
let buttonMod1,buttonMod2,buttonMod3,buttonMod4,buttonMod5,buttonMod6;
let riffAudio;
function preload() {
  // put preload code here
  handPose = ml5.handPose();
  modelo1 = loadModel('./3dModels/spine.obj', true)
  modelo2 = loadModel('./3dModels/skull.obj', true)
  modelo3 = loadModel('./3dModels/ribs.obj', true)
  modelo4 = loadModel('./3dModels/arm.obj', true)
  modelo5 = loadModel('./3dModels/leg.obj', true)
  modelo6 = loadModel('./3dModels/pelvis.obj', true)
  textura = loadImage('./textures/bone.jpg')
  fuente = loadFont('./fonts/GROBOLD.ttf')
  buttonMod1 = loadImage('./images/spine.png')
  buttonMod2 = loadImage('./images/bad_to_the_bone.png')
  buttonMod3 = loadImage('./images/ribs.png')
  buttonMod4 = loadImage('./images/arm.png')
  buttonMod5 = loadImage('./images/leg.png')
  buttonMod6 = loadImage('./images/pelvis.png')
  riffAudio = loadSound('./sounds/bad_to_the_bone_riff.mp3.mpeg');
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight, WEBGL);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
  let proporcionIz = 1;
  let proporcionDerX=0;
  let proporcionDerY=0;
  background(220)
  image(buttonMod1, 0 - windowWidth / 2, 0 - windowHeight / 2, 80, 80);
  image(buttonMod2, 0 - windowWidth / 2, 0 - windowHeight / 2 + 90, 80, 80);
  image(buttonMod3, 0 - windowWidth / 2, 0 - windowHeight / 2 + 180, 80, 80);
  image(buttonMod4, 0 - windowWidth / 2, 0 - windowHeight / 2 + 270, 80, 80);
  image(buttonMod5, 0 - windowWidth / 2, 0 - windowHeight / 2 + 360, 80, 80);
  image(buttonMod6, 0 - windowWidth / 2, 0 - windowHeight / 2 + 450, 80, 80);
  push()
  ambientLight(80)                          
  directionalLight(255, 255, 255, 0, 0, -1) 
  directionalLight(150, 120, 100, 1, 1, 0)  
  specularMaterial(50)                 
  texture(textura)
  textureMode(NORMAL)
  noStroke()
  scale(zoom)
  rotateX(PI)
  rotateY(PI)
  rotateX(rotX)
  rotateY(rotY)
  model(modelSelection(modeloActual))
  pop()

  let rightHand = hands.find(h => h.handedness === "Right");
  let leftHand  = hands.find(h => h.handedness === "Left");

  push()
  translate(width/2 - camW, height/2 - camH)
  scale(escala)
  image(video, 0, 0, 640, 480)
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
  if (rightHand) {
    let wrist        = rightHand.keypoints[0];
    let middleFinger = rightHand.keypoints[12];
    let centerX = (wrist.x + middleFinger.x) / 2;
    let centerY = (wrist.y + middleFinger.y) / 2;
    let pinchX = dist(wrist.x, wrist.y, middleFinger.x, middleFinger.y);
    fill(255, 0, 0, 220); stroke(0); strokeWeight(2);
    circle(centerX, centerY, pinchX);

    let indexMcp = rightHand.keypoints[5];
    let pinkyMcp = rightHand.keypoints[17];
    centerX = (indexMcp.x + pinkyMcp.x) / 2;
    centerY = (indexMcp.y + pinkyMcp.y) / 2;
    let pinchY = dist(indexMcp.x, indexMcp.y, pinkyMcp.x, pinkyMcp.y);
    fill(0, 0, 255, 220); stroke(0); strokeWeight(2);
    circle(centerX, centerY, pinchY);
  }
  if (leftHand) {
    let finger = leftHand.keypoints[8];
    let thumb  = leftHand.keypoints[4];
    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;
    let pinchZoom  = dist(finger.x, finger.y, thumb.x, thumb.y);
    fill(0, 255, 255, 220); stroke(0); strokeWeight(2);
    circle(centerX, centerY, pinchZoom);
  }
  pop() 

  if (rightHand) {
    let wrist        = rightHand.keypoints[0];
    let middleFinger = rightHand.keypoints[12];
    let pinchX = dist(wrist.x, wrist.y, middleFinger.x, middleFinger.y);
    let indexMcp = rightHand.keypoints[5];
    let pinkyMcp = rightHand.keypoints[17];
    let pinchY = dist(indexMcp.x, indexMcp.y, pinkyMcp.x, pinkyMcp.y);
    let punto1X = rightHand.keypoints[5];
    let punto2X = rightHand.keypoints[17];
     let punto1Y = rightHand.keypoints[0];
    let punto2Y = rightHand.keypoints[12];
    proporcionDerX = dist(punto1X.x, punto1X.y, punto2X.x, punto2X.y) / pinchX;
    proporcionDerY = dist(punto1Y.x, punto1Y.y, punto2Y.x, punto2Y.y) / pinchY;
    /*push()
    resetShader()
    textFont(fuente)      
    fill(255, 0, 0); noStroke()
    textSize(20)
    text("PinchX: " + nf(pinchX,1,1), -width/2 + 10, -height/2 + 30)
    text("PinchY: " + nf(pinchY,1,1), -width/2 + 10, -height/2 + 55)
    text("ProporciónDerX: " + nf(proporcionDerX,1,1), -width/2 + 10, -height/2 + 135)
    text("ProporciónDerY: " + nf(proporcionDerY,1,1), -width/2 + 10, -height/2 + 160)
    pop()*/
  }
  if (leftHand) {
    let finger = leftHand.keypoints[8];
    let thumb  = leftHand.keypoints[4];
    let pinchZoom  = dist(finger.x, finger.y, thumb.x, thumb.y);
    let punto1 = leftHand.keypoints[5];
    let punto2  = leftHand.keypoints[17];
    proporcionIz=dist(punto1.x, punto1.y, punto2.x, punto2.y)/pinchZoom;
    /*push()
    resetShader()
    textFont(fuente)      
    fill(255, 0, 0); noStroke()
    textSize(20)
    text("Zoom: " + nf(pinchZoom,1,1), -width/2 + 10, -height/2 + 85)
    text("ProporciónZoom: " + nf(proporcionIz,1,1), -width/2 + 10, -height/2 + 110)
    pop()*/
  }

  if(proporcionIz > 2){
    controlZoom(-0.03)
  } else if(proporcionIz < .6){
    controlZoom(0.03)
  }
  if (proporcionDerX > .5) {
      controlRotX(-0.04)
    }

    if (proporcionDerY > 3) {
      controlRotY(-0.03)
    } 
}

function gotHands(results) {
  hands = results;
}

function controlZoom(v){
  zoom += v;
}

function controlRotX(v) { 
  rotX += v;
}

function controlRotY(v) {  
  rotY += v;
}

function mousePressed() {
  let webglMouseX = mouseX - windowWidth / 2;
  let webglMouseY = mouseY - windowHeight / 2;

  // Todos los botones comparten el mismo rango en X (el ancho de 80px en el extremo izquierdo)
  if (webglMouseX >= 0 - windowWidth / 2 && webglMouseX <= 0 - windowWidth / 2 + 80) {
    
    // Botón 1 (Columna vertebral) -> Y de 0 a 80
    if (webglMouseY >= 0 - windowHeight / 2 && webglMouseY <= 0 - windowHeight / 2 + 80) {
      modeloActual = 1;
    }
    
    // Botón 2 (Cráneo / Riff de audio) -> Y de 90 a 170
    else if (webglMouseY >= 0 - windowHeight / 2 + 90 && webglMouseY <= 0 - windowHeight / 2 + 170) {
      modeloActual = 2;
      if (riffAudio.isPlaying()) {
        riffAudio.stop();
      }
      riffAudio.play();
    }
    
    // Botón 3 (Costillas) -> Y de 180 a 260
    else if (webglMouseY >= 0 - windowHeight / 2 + 180 && webglMouseY <= 0 - windowHeight / 2 + 260) {
      modeloActual = 3;
    }
    
    // Botón 4 (Brazo) -> Y de 270 a 350
    else if (webglMouseY >= 0 - windowHeight / 2 + 270 && webglMouseY <= 0 - windowHeight / 2 + 350) {
      modeloActual = 4;
    }
    
    // Botón 5 (Pierna) -> Y de 360 a 440
    else if (webglMouseY >= 0 - windowHeight / 2 + 360 && webglMouseY <= 0 - windowHeight / 2 + 440) {
      modeloActual = 5;
    }
    
    // Botón 6 (Pelvis) -> Y de 450 a 530
    else if (webglMouseY >= 0 - windowHeight / 2 + 450 && webglMouseY <= 0 - windowHeight / 2 + 530) {
      modeloActual = 6;
    }
  }
}

function modelSelection(modelo) {
  switch (modelo) {
    case 1: return modelo1;
    case 2: return modelo2;
    case 3: return modelo3;
    case 4: return modelo4;
    case 5: return modelo5;
    case 6: return modelo6;
    default: return modelo1;
  }
}