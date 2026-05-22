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
    let finger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;
    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;
    let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);
    fill(0, 255, 0, 200);
    stroke(0);
    strokeWeight(2);
    circle(centerX, centerY, pinch);
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

function gotHands(results) {
  hands = results;
}
