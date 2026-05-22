let handPose;
let video;
let hands = [];
function preload() {
  // put preload code here
  handPose = ml5.handPose();
}

function setup() {
  // put setup code here
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
image(video, 0, 0, width, height);
 for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
        for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
            fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
 if (hands.length > 0) {
    let finger = hands[0].keypoints[8];
    let thumb = hands[0].keypoints[4];
    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;
    let pinchZoom = dist(finger.x, finger.y, thumb.x, thumb.y);
    fill(0, 255, 0, 200);
    stroke(0);
    strokeWeight(2);
    circle(centerX, centerY, pinchZoom);
  }
   if (hands.length > 0) {
    let wrist = hands[0].keypoints[0];
    let middleFinger = hands[0].keypoints[12];
    let centerX = ( wrist.x + middleFinger.x) / 2;
    let centerY = (wrist.y + middleFinger.y) / 2;
    let pinchX = dist(wrist.x, wrist.y, middleFinger.x, middleFinger.y);
    fill(255 ,0, 0, 200);
    stroke(0);
    strokeWeight(2);
    circle(centerX, centerY, pinchX);
  }
  if (hands.length > 0) {
    let indexFingerMcp = hands[0].keypoints[5];
    let pinkyMcp = hands[0].keypoints[17];
    let centerX = ( indexFingerMcp.x + pinkyMcp.x) / 2;
    let centerY = (indexFingerMcp.y + pinkyMcp.y) / 2;
    let pinchY = dist(indexFingerMcp.x, indexFingerMcp.y, pinkyMcp.x, pinkyMcp.y);
    fill(0 ,0, 255, 200);
    stroke(0);
    strokeWeight(2);
    circle(centerX, centerY, pinchY);
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}