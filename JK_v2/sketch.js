// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;
let isFirstTime = true;
let song;
let gun;
// The flag initiates which button has been pressed
let flag = 0;

///////////////////////////////////////
//**********     SETUP    ************
///////////////////////////////////////
function setup() {
  // 1: Set up the video 
  //I have set the canvas to this size since its easy to locate positions. 
  //In the final version we should use WindowHeight/Width
  var canvs = createCanvas(1000, 500);
  video = createCapture(VIDEO);
  video.hide();

  // 2: Get PoseNet Running
  poseNet = ml5.poseNet(video, modelLoaded);
  var context = new AudioContext();

// 3: Getting all the sound effects ready
  gun = new Pizzicato.Sound('https://www.mboxdrive.com/410399__erokia__30-30-lever-rifle-gunshot.mp3', function() {
    console.log('gun loaded');
  });
 
 // 4: The button to start the song
  document.querySelector('button').addEventListener('click', function() {
  context.resume().then(() => {
      song = new Pizzicato.Sound('https://www.mboxdrive.com/biisi.mp3', function() {
        // Sound loaded!
        console.log('Playback resumed successfully');
        song.play();
        console.log('PLAYING')
      });
  });
  });

  // 5:The button to stop the song 
  document.getElementById('stopbutton').addEventListener('click', function() {
    song.stop();
    console.log('STOPPED')
  });

  poseNet.on('pose', gotPoses);
}

///////////////////////////////////////
//****** EFFECTS AND TRIGGERS ****** 
///////////////////////////////////////

function gotPoses(poses) {

  
  /////////   SETTING UP    ///////
  // Decide which part you want to track
  let leftShoulder = {}; 
  let rightWrist = {};
  let reverbflag = 1;

  // sound effect for REVERB
  var reverb = new Pizzicato.Effects.Reverb({
    time: 1,
    decay: 0.01,
    reverse: true,
    mix: 0.5
  });
  // sound effect for REVERB
  var comp = new Pizzicato.Effects.Compressor({
      threshold: -20,
      knee: 22,
      attack: 0.05,
      release: 0.05,
      ratio: 18
  });
  
  if (poses.length > 0) {
    pose = poses[0].pose;

    // storing coordinates of body positions we may need
    // Right Wrist and Left Wrist
    let rW_x = Math.round(pose.rightWrist.x);
    let rW_y = Math.round(pose.rightWrist.y);

    let lW_x = Math.round(pose.leftWrist.x);
    let lW_y = Math.round(pose.leftWrist.y);


    skeleton = poses[0].skeleton;
    if (skeleton.length > 0) {
      skeleton[0].forEach(element => {
        // check if your selected part has been detected by the webcam
        if(element.part === 'rightWrist') {
          rightWrist = element;
          console.log('rightWrist ');
        }
      });
    }


  ///////// BUTTON POSISTIONS /////
  if(rW_x>0 && rW_x<300) {
    // Reverb Button == flag 1
    if(rW_y>400 && rW_y<500){
      flag = 1;
      console.log("flag 1");
      song.addEffect(reverb);
    } 
    // Stop Reverb Button == flag 2
    else if (rW_y>100 && rW_y<200){
      flag = 2;
      console.log("flag 2");
      song.removeEffect(reverb);
    }
  }

 
  /////////   REVERB      ///////// 
  if(flag == 4) {
    reverbflag = 1;
    console.log('Reverb triggered')
    if(song) {
      if(reverbflag == 1)
        console.log('inside the iff');
      // reverb gesture = when the two wrists are together and they move across the screen
        let leftWristPos = Math.round(pose.leftWrist.x);
        let rightWristPos = Math.round(pose.rightWrist.x);
        let diff = Math.abs(leftWristPos - rightWristPos)
        if (diff < 10){
          reverb.decay = Math.round((leftWristPos +0.01)/100)
          console.log('Reverb decay', reverb.decay) 
        }
      }
  }

  

  /////////  STOP REVERB  ///////// 
  if(flag == 5) {
      reverbflag = 0;
      reverb.decay = 0.01;
      console.log('Inside the stop');
        if (song) {
          console.log('reverb value decay is', reverb.decay); 
        }
  }

  /////////  COMPRESSOR ///////// 

    if(rW_x>800 && rW_x<1000) {
      flag = 3;
      if(rW_y>400 && rW_y<500){
        gun.play();
      }
    } 


    
  }

}


///////////////////////////////////////
//****** SKELETAL TRACKING ****** 
///////////////////////////////////////


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  /////////   FLIPPING THE CANVAS      ///////// 
  push();
  translate(width,0);
  scale(-1, 1);
  image(video, 0, 0);
  pop();

 

  /////////  WORDS FOR EFFECTS AND TRIGGERS ///////// 
  // For Reverb
  if(flag == 1){
      textSize(32);
      text('Reverb', 10, 30);
      fill(0, 102, 153);
      text('Reverb', 10, 60);
      fill(0, 102, 153, 51);
      text('Reverb', 10, 90);
    }
  // For Stop Reverb
    if(flag == 2){
      textSize(32);
      text('Stopped', 10, 30);
      fill(0, 102, 153);
      text('Stopped', 10, 60);
      fill(0, 102, 153, 51);
      text('Stopped', 10, 90);
    }
// For Compressor
    if(flag == 3){
      textSize(32);
      text('Compressor', 10, 30);
      fill(0, 102, 153);
      text('Compressor', 10, 60);
      fill(0, 102, 153, 51);
      text('Compressor', 10, 90);
    }


  if (pose) {

  /////////  LOCATION OF BUTTONS ///////// 
  //Reverb
  textSize(18);
  fill('Green');
  rect(800,380,120,40);
  text('REVERB', 820, 400);

  // Stop Reverb
  fill('Red');
  rect(800,50,120,40);
  text('STOP REVERB', 820, 70);

  // Compressor
  fill('orange');
  rect(100,380,120,40);
  text('COMPRESSOR', 120, 400);



  /////////  SKELETON DRAWING ///////// 
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(1000- eyeR.x, eyeR.y, 1000-eyeL.x, eyeL.y);
    fill(255, 0, 0);
    ellipse(1000-pose.nose.x, pose.nose.y, d);
    fill(0, 0, 255);
    ellipse(1000-pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(1000-pose.leftWrist.x, pose.leftWrist.y, 32);
    
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = 1000-pose.keypoints[i].position.x;
      let y = 1000-pose.keypoints[i].position.y;
      fill(0,255,0);
      ellipse(x,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(1000-a.position.x, a.position.y,1000-b.position.x,b.position.y);      
    }
  }
}