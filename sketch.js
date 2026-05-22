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
  let rightHand = hands.find(h => h.handedness === "Right");
  let leftHand  = hands.find(h => h.handedness === "Left");

  if (rightHand) {
    let finger = rightHand.keypoints[8];
    let thumb  = rightHand.keypoints[4];
    let centerX   = (finger.x + thumb.x) / 2;
    let centerY   = (finger.y + thumb.y) / 2;
    let pinchZoom = dist(finger.x, finger.y, thumb.x, thumb.y);
    fill(0, 255, 0, 200); stroke(0); strokeWeight(2);
    circle(centerX, centerY, pinchZoom);

    let wrist        = rightHand.keypoints[0];
    let middleFinger = rightHand.keypoints[12];
    centerX = (wrist.x + middleFinger.x) / 2;
    centerY = (wrist.y + middleFinger.y) / 2;
    let pinchX = dist(wrist.x, wrist.y, middleFinger.x, middleFinger.y);
    fill(255, 0, 0, 200); stroke(0); strokeWeight(2);
    circle(centerX, centerY, pinchX);

    let indexMcp = rightHand.keypoints[5];
    let pinkyMcp = rightHand.keypoints[17];
    centerX = (indexMcp.x + pinkyMcp.x) / 2;
    centerY = (indexMcp.y + pinkyMcp.y) / 2;
    let pinchY = dist(indexMcp.x, indexMcp.y, pinkyMcp.x, pinkyMcp.y);
    fill(0, 0, 255, 200); stroke(0); strokeWeight(2);
    circle(centerX, centerY, pinchY);
  }

  if (leftHand) {
    let finger = leftHand.keypoints[8];
    let thumb  = leftHand.keypoints[4];
    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;
    let pinchY  = dist(finger.x, finger.y, thumb.x, thumb.y);
    fill(0, 255, 255, 200); stroke(0); strokeWeight(2);
    circle(centerX, centerY, pinchY);
  }
}

function gotHands(results) {
  hands = results;
}