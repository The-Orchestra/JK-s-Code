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
//****** SETUP ****** 
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


    // The position of each of the buttons on the screen
    if(rW_x>0 && rW_x<920) {
      // Reverb Button
      if(rW_y>440 && rW_y<560){
        flag = 1;
        console.log("flag 1");
        song.addEffect(reverb);
      } 
      // Stop Reverb Button
      else if (rW_y>100 && rW_y<220){
        flag = 2;
        console.log("flag 2");
        song.removeEffect(reverb);
      }
    }

    /**********buffer of gun shoting
     *** raise your right hand to touch the circle
     *** to trigger the gun shoting
    */
   /* if(rW_x>170 && rW_x<230) {
      if(rW_y>70 && rW_y<130)
        gun.play();
    }

*/
    
//  For REVERB
/*    if(flag == 4) {
      song.addEffect(reverb);

      // you can turn this flag to zero at the start of any other effect button being triggerred.
     //reverbflag = 0;
      console.log('Reverb triggered!')
      let leftWristPos = Math.round(pose.leftWrist.x);
    
      // try 1: the gesture is LeftWrist moving from left -> right, max -> min
      // try with changing decay first: the lowest decay is 0 and max is 10
      

      // if(song) {
      //   song.addEffect(reverb);
      //   if(reverbflag == 1)
      //     console.log('In the reverb if condition');
      //     reverb.delay = Math.round((leftWristPos +0.01)/100) ;
      //     if (reverb.delay > 10) {
      //       reverb.delay = 10;
      //     }
      //     console.log('reverb value is', reverb.delay);
      //     reverbflag = 0;
      //     song.removeEffect(reverb);
      // }


      // try 2: the gesture is LeftWrist moving from left -> right, max -> min
      // try with changing time : the lowest time delay is 0 and max is 10
      

      if(song) {
        //if(reverbflag == 1) {
          console.log('In the reverb if condition');
          lwpos = Math.round(leftWristPos) ;
          if (lwpos >= 0 && lwpos < 500) {
            reverb.time = 3;
          } else if (lwpos >= 500 && lwpos <= 1000) {
            reverb.time = 10;
          }
          
          console.log('reverb value of time is', reverb.time);
         // reverbflag = 0;
       // }
          

          //song.removeEffect(reverb);
      }




      // try 3: the gesture is when right and left wrist come together
      // try with changing decay first: the lowest decay is 0 and max is 10
      
      /*if (song){
       if (dist(pose.rightElbow.x, pose.rightElbow.y, pose.rightWrist.x, pose.rightWrist.y) < 20) {
              dryWet = constrain(map(pose.leftElbow.x, 0, width, 0, 1), 0, 1);
              reverb.drywet(dryWet);
            } 
      }*/
      



  //  }
// For REVERB TRY 2, using anqis code

if(flag == 4) {
   //   song.volume = 1;
    reverbflag = 1;
      //console.log('pingPongDelay ')
      //let freq = Math.round(pose.leftWrist.y);
    
      // ******** pingPongDelay MANIPULATION *************
      
     // volume = 1 - (freq-0)/(480-0) * (1-0) + 0
      console.log('Reverb triggered  ')
      if(song) {
        // pingPongDelay.time = volume*0.4;
        // pingPongDelay.feedback = volume*0.6;
        // pingPongDelay.mix = volume*0.5;
        if(reverbflag == 1)
         console.log('inside the iff');
          let leftWristPos = Math.round(pose.leftWrist.x);
          reverb.decay = Math.round((leftWristPos +0.01)/100)
          console.log('Reverb decay', reverb.decay) 
      }
              //song.removeEffect(reverb);

    }

  



//  For stopping Reverb
    if(flag == 5) {
      reverbflag = 0;
      reverb.decay = 0.01;
      console.log('Inside the stop');
        if (song) {
          console.log('reverb value decay is', reverb.decay); 
        }
        
       // song.addEffect(reverb);
      }
    
  }

}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  /***********flip the video ***********
   *** meaning that x need to be transform
   *** x = 640 - x' 
   ***/
  push();
  translate(width,0);
  scale(-1, 1);
  image(video, 0, 0);
  pop();

  /***********flag is used for control the button 
   *** flag == 1 --> volume
   *** flag == 2 --> pan
   *** flag == 3 --> pingPongDelay
  */

  // Words displayed for each effect
/*  if(flag == 1){
    textSize(32);
    text('Volume', 10, 30);
    fill(0, 102, 153);
    text('Volume', 10, 60);
    fill(0, 102, 153, 51);
    text('Volume', 10, 90);
  }
  if(flag == 2){
    textSize(32);
    text('Pan', 10, 30);
    fill(0, 102, 153);
    text('Pan', 10, 60);
    fill(0, 102, 153, 51);
    text('Pan', 10, 90);
  }
  if(flag == 3){
    textSize(32);
    text('pingPongDelay', 10, 30);
    fill(0, 102, 153);
    text('pingPongDelay', 10, 60);
    fill(0, 102, 153, 51);
    text('pingPongDelay', 10, 90);
  }*/
  if(flag == 4){
      textSize(32);
      text('Reverb', 10, 30);
      fill(0, 102, 153);
      text('Reverb', 10, 60);
      fill(0, 102, 153, 51);
      text('Reverb', 10, 90);
    }
    if(flag == 5){
      textSize(32);
      text('Stopped', 10, 30);
      fill(0, 102, 153);
      text('Stopped', 10, 60);
      fill(0, 102, 153, 51);
      text('Stopped', 10, 90);
    }




  if (pose) {

    /*********location of buttons*/

    // Pause and play 
   /* fill(230, 230, 250);
    ellipse(200,200,100);

    fill(540, 255, 255);
    rect(580,100,40,80);

    fill(540, 255, 255);
    rect(580,220,40,80);

    fill(540, 255, 255);
    rect(580,340,40,80);*/

// Just the button for Reverb
    fill(540, 255, 255);
    rect(800,440,40,80);

// a button to  stop the Reverb 
    fill('red');
    rect(800,100,40,80);

// skeleton drawing
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d);
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0,255,0);
      ellipse(x,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y,b.position.x,b.position.y);      
    }
  }
}