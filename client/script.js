// A lot of this is some drawing shennanigans, but I'll try my best to walk throught it

let screenNumber = 0; //keep track of screen states
let font; //hold the font
let loading = true; 
const socket = io(); //connect the the socket io instance
let amp; //amp for sound
let sounds = []; //hold a list of sounds
let colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF"]; // pretty colors
let circleSize = 0.25



// all the drawing and audio loading tasks that need to be preloaded
function preload(){
    font = loadFont("Jost-Medium.ttf"); 
    //load all of the audio files into the sound library (Howl)
    fetch('/filenames').then( response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    }).then( (json) => {
        for(let i = 0; i < json.length; i++){
            sounds.push(new Howl({src: `sounds/${json[i]}`, preload: true}));
        }
    }).then(()=>{
        loading = false;
    }).catch( err => console.error(`Fetch problem: ${err.message}`) );
    
    //announce itself as a client
    socket.emit("client");
}

//setup some drawing things
function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont(font);
    angleMode(DEGREES);

    // Create an audio context instance if WebAudio is supported
    let context = (window.AudioContext || window.webkitAudioContext) ?
    new (window.AudioContext || window.webkitAudioContext)() : null;
    if (context){ let unmuteHandle = unmute(context, false, false);}
}

//when it receives a playSound message from the server, it plays the sound
socket.on("playSound", (sound)=>{
    if(screenNumber != 0){
        sounds[sound].play();
    }
});

//same for loop sound
socket.on("loopSound", (sound, loop)=>{
    
    sounds[sound].loop(loop);
});

//... and for stop!
socket.on("stop",(sound)=>{
    if(screenNumber != 0){sounds[sound].stop();}
});

socket.on("stopAll",()=>{
    if(screenNumber != 0){
        for(var j = 0; j < sounds.length; j++){
            sounds[j].stop();
        }  
    }
});

//checking if on mobile
function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
  }

//this is all the fun drawing stuff
function draw() {
    
    //don't render anything if people are landscape (to keep the experience consistent)
    if(windowHeight > windowWidth || !isMobile()){
        background(255);
        // a courtesy loading screen
        if(loading){
            fill(100);
            textSize(height/10);
            textAlign(CENTER,CENTER);
            rectMode(CENTER);
            text("Loading Samples...", width /2, height /2, width * 0.8, height * 0.8);
        }else{
            //handle the screen rendering
            if(screenNumber == 0){
                mainMenu();
            }else{
                mainScreen(screenNumber);
            }
        }
        
    }else{
        //tell people to turn their screens
        background(255);
        fill(100);
        textSize(height/10);
        textAlign(CENTER,CENTER);
        rectMode(CENTER);
        text("Please rotate your device to portait orientation and lock rotation :)", width /2, height /2, width * 0.8, height * 0.8);
    }
}

//fix the window when people move their screen around
function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}

//All the rendering for the main menu
function mainMenu(){
    textAlign(CENTER,BASELINE);
    rectMode(CENTER);
    noStroke();
    fill(200);
    if(!isMobile()){ circleSize = 0.1 }
    circle(width * 0.25, height * 0.4, width * circleSize);
    circle(width * 0.75, height * 0.4, width * circleSize);
    circle(width * 0.25, height * 0.6, width * circleSize);
    circle(width * 0.75, height * 0.6, width * circleSize);
    fill(255);
    textSize(height / 20);

    text("A", width *0.25, height* 0.417);
    text("B", width *0.75, height* 0.417);
    text("C", width *0.25, height* 0.617);
    text("D", width *0.75, height* 0.617);

    fill(50);
    textSize(height * 0.077);
    text("BeepBoops", width/ 2, height * 0.2);
    textSize(height * 0.02);
    text("By Lainie Fefferman, Randiel Zoquier,\nand Kate Tramm", width/ 2, height * 0.85);
}

//all the rendering for the boop screens
function mainScreen(screenNo){
    noStroke();

    for(let sound in sounds){
        if(sounds[sound].playing()){
            fill(colors[screenNumber - 1]);
            
        }else{
            fill(0,0);
        }
        rectMode(CORNER);
        rect(0,0,width,height);
    }
    
    if(isMobile())
        {
            //mobile sizing
            if(screenNo == 1){
                noStroke();
                fill(240);
                textSize(height * 1.3);
                push();
                rotate(130);
                text("A", width / 2, 0);
                pop();
            }
            if(screenNo == 2){
                noStroke();
                fill(240);
                textSize(height * 1.9);
                push();
                rotate(80);
                translate(width *0.8, height *0.5);
                text("B", 0, 0);
                pop();

            }
            if(screenNo == 3){
                noStroke();
                fill(240);
                textSize(height * 1.8);
                push();
                rotate(-70);
                translate(width * - 1.25, height *0.65);
                text("C", 0, 0);
                pop();
            }
            if(screenNo == 4){
                noStroke();
                fill(240);
                textSize(height * 1.13);
                push();
                rotate(10);
                translate(width *0.5, height *0.9);
                text("D", 0, 0);
                pop();
            }
        }else{
            //desktop sizing
            if(screenNo == 1){
                noStroke();
                fill(240);
                textSize(height * 1.3);
                push();
                rotate(130);
                text("A", width / 2, 0);
                pop();
            }
            if(screenNo == 2){
                noStroke();
                fill(240);
                textSize(height * 1.9);
                push();
                rotate(80);
                translate(width *0.8, height *0.5);
                text("B", 0, 0);
                pop();
            }
            if(screenNo == 3){
                noStroke();
                fill(240);
                textSize(height * 1.8);
                push();
                rotate(-70);
                translate(width * - 1.25, height *0.65);
                text("C", 0, 0);
                pop();
            }
            if(screenNo == 4){
                noStroke();
                fill(240);
                textSize(height * 1.13);
                push();
                rotate(10);
                translate(width *0.5, height *0.9);
                text("D", 0, 0);
                pop();
            }
    }

    fill(100);
    stroke(100);
    strokeWeight(height * 0.005);
    strokeCap(ROUND);
    line(width*0.07, height *0.05, width * 0.13, height *0.05);
    line(width*0.07, height *0.05, width * 0.09, height *0.04);
    line(width*0.07, height *0.05, width * 0.09, height *0.06);

    

    
}

//handle input... wait that's what the function is called
function mouseClicked(){
    handleInput(mouseX, mouseY);
    
}
//covering bases for touch screen input and normal mouse input
function touchStarted(){
    handleInput(touches[0].x, touches[0].y);
}


function handleInput(x,y){
    //console.log(`input handled: x:${x} y" ${y}`);
    //the group selection process
    if(screenNumber == 0){
        let distToA = dist(x, y, width *0.25, height * 0.4);
        let distToB = dist(x, y, width *0.75, height * 0.4);
        let distToC = dist(x, y, width *0.25, height * 0.6);
        let distToD = dist(x, y, width *0.75, height * 0.6);

        if(distToA < width *0.25){
            screenNumber = 1;
            socket.emit("groupA");
        }

        if(distToB < width *0.25){
            screenNumber = 2;
            socket.emit("groupB");
        }

        if(distToC < width *0.25){
            screenNumber = 3;
            socket.emit("groupC");
        }

        if(distToD < width *0.25){
            screenNumber = 4;
            socket.emit("groupD");
        }
    }else{
        //back button
        let distToBack = dist(x, y, width *0.1, height * 0.05);

        if(distToBack < width *0.1){

            let roomToLeave;

            if (screenNumber == 1){
                roomToLeave = "groupA";
            }
            if (screenNumber == 2){
                roomToLeave = "groupB";
            }
            if (screenNumber == 3){
                roomToLeave = "groupC";
            }
            if (screenNumber == 4){
                roomToLeave = "groupD";
            }
            screenNumber = 0;
            for(var j = 0; j < sounds.length; j++){
                sounds[j].stop();
            }  

            socket.emit("resetGroup", roomToLeave);
        }
    } 
}