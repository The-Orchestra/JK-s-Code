# Orchestra Javascript Version

## Steps to Run:

1. Clone the project on your machine
2. Download the Chrome extension https://chrome.google.com/webstore/detail/moesif-orign-cors-changer/digfbfaphojjndkpccljibejjbppifbc
3. Open 'index.html' on your chrome browser
4. Open the devtools window by right-clicking on the browser screen and clicking on "Inspect". Have "console" window open.
5. Make sure you are out of the webcam view initially before doing the next step.
6. Click on the "click me" button on the top left corner of the screen and wait for a few seconds till the song plays.
7. Come in the webcam view and get your shoulders tracked :) You can monitor the logs in the console window in the devtools.

## Jehan's update:
There are three buttons here:
1: Reverb
2: Stop Reverb (you won't need this in the final version since each new effect should stop the previous)
3: Compressor (I think we should drop this one, so I have a gun sound effect here just in case)

The reverb effect is triggered by the button which works on "flags". Once it's triggered you can continuously change reverb by joining your left and right wrist together and moving them from the left -> right of the screen.

I kept the mirrored effect that Anqi had since I think its a better UX for a user. But this means that some of the values you have to take from the reverse order.




