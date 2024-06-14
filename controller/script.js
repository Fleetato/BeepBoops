let files = []; // an empty array to hold all the names of the sound files

//define the empty divs in HTML so it can be populated by buttons later
let groupA = document.getElementById("groupA");
let groupB = document.getElementById("groupB");
let groupC = document.getElementById("groupC");
let groupD = document.getElementById("groupD");

//grab the filenames from the server and then....
fetch('/filenames').then( response => {
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
}).then( (json)=>{
    //... generate a button for each group usinge that file name info
    for (let i = 0; i < json.length; i++){
        groupA.innerHTML += 
        `<div class="sampleButtons">
        <button class="play" onclick="playSound('groupA', ${i})"> ${json[i]} </button>  
        <label class="loopButton"></label><input  type="checkbox" onclick="loop('groupA', ${i}, this)" /> 🔁 </label> 
        <button class="stop" onclick="stop('groupA', ${i})">Stop</button>
        </div>`;
        groupB.innerHTML += 
        `<div class="sampleButtons">
        <button class="play"  onclick="playSound('groupB', ${i})"> ${json[i]} </button>
        <label class="loopButton"></label><input  type="checkbox" onclick="loop('groupB', ${i}, this)" /> 🔁 </label> 
        <button class="stop" onclick="stop('groupB', ${i})">Stop</button>
        </div>`;
        groupC.innerHTML += `<div class="sampleButtons"><button class="play"  onclick="playSound('groupC', ${i})"> ${json[i]} </button>
        <label class="loopButton"></label><input  type="checkbox" onclick="loop('groupC', ${i}, this)" /> 🔁 </label> 
        <button class="stop" onclick="stop('groupC', ${i})">Stop</button>
        </div>`;
        groupD.innerHTML += `<div class="sampleButtons">
        <button class="play"  onclick="playSound('groupD', ${i})"> ${json[i]} </button>
        <label class="loopButton"></label><input  type="checkbox" onclick="loop('groupD', ${i}, this)" /> 🔁 </label> 
        <button class="stop" onclick="stop('groupD', ${i})">Stop</button>
        </div>`;
    }
}).catch( err => console.error(`Fetch problem: ${err.message}`) );


//connect the the socket instance
const socket = io();
socket.emit("controller");

//functions triggered by buttons to send messages to the server for control
function playSound(group, fileName){
    socket.emit("play", group, fileName);
}

function stop(group,fileName){
    socket.emit("stop", group, fileName);
}

function loop(group, file, check){
    socket.emit("loop",group, file, check.checked);
}


