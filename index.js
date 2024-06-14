/*
This is the main server code, which handles the communication between the client, controller, and loads the audio files
*/


//importing important libraries
const http = require('http');
const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors');
const fs = require("fs");
const multer = require("multer");
const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app).listen(8080);

let controller; // the controller instance (mainly to keep one controller at a time)

//this guy loads up all the sounds in the sounds folder using multer, and saves the list of file names
let stor = multer.diskStorage({destination: (req,file,cb)=>{
    cb(null, "client/sounds/");

},
filename: (req,file,cb)=>{
    const {originalname} = file;
    console.log(originalname);
    cb(null, originalname);
}});
let upload = multer({storage: stor});

//instantiating the server and adding the other pages so it can be loaded by the site
const io = new Server(server);
app.use( "/controller", express.static(__dirname +"/controller/"));
app.use("/", express.static(__dirname +"/client/"));
app.use("/client", express.static(__dirname +"/client/"));
app.use("/files", express.static(__dirname + "/files"));

//if someone requests the main webpage, they get served the client website
app.get("/", (req,res)=>{
    res.sendFile(__dirname +"/client/index.html");
});

//if someone requests the filenames of all the sound file names
app.get("/filenames/", (req, res)=>{
    let fileNames = fs.readdirSync('client/sounds/');
    res.send(fileNames);
});

// if someone requests the controller webpage, they get served the controller website
app.get("/controller", (req,res)=>{
    res.sendFile(__dirname +"/controller/index.html");
});

app.get("/client", (req, res)=>{
    res.sendFile(__dirname +"/client/index.html");
});

//this handles the delete message when deleting files from the storage
app.delete("/delete", bodyParser.text(), (req, res)=>{
    console.log(req.body);

    delFile = __dirname + "/client/sounds/" + req.body;

    fs.stat(delFile, (err, stats)=>{
        if (err) {
            return console.error(err);
        }
        fs.unlink( delFile, (err)=>{
            if(err) return console.log(err);
            console.log(`file ${req.body} deleted successfully`);
        });
    });
    
});

//this is the code that handles the upload request to the server. notice the "upload.single". maybe this could be a multi upload hmmmm
app.post("/upload", upload.single('upload'),(req,res)=>{
    return res.redirect('/files'); 
});


//FROM HERE ON OUT IT"S SOCKET.IO LAND
 io.on("connection", (socket)=>{

    //when the socket.io client sends a message saying "hey, I'm the controller!", it does a few things
    socket.on("controller", ()=>{

        //if a controller doesn't exist yet, add a controller
        if(!controller){
            controller = socket;
            console.log("controller connected");
        }
        
        //handle controller disconnection
        controller.on("disconnect", ()=>{
            controller = undefined;
            console.log("controller disconnected");
        });
    });

    //lets us know a client connected 
    socket.on("client", ()=>{
        console.log("client connected");
    });

    //next few lines add the connecting client to a specific croup
    socket.on("groupA", ()=>{
        socket.join("groupA");
    });

    socket.on("groupB", ()=>{
        socket.join("groupB");
    });

    socket.on("groupC", ()=>{
        socket.join("groupC");
    });

    socket.on("groupD", ()=>{
        socket.join("groupD");
    });

    //handle leaving a room
    socket.on("resetGroup", (room)=>{
        socket.leave(room);
    });

    //when the controller sends a play message, send it to the right group
    socket.on("play", (groupName, fileNo)=>{
        io.to(groupName).emit("playSound", fileNo);
    });

    //when the controller sends a loop command, send it to the right client groups
    socket.on("loop", (groupName, fileNo, loopStatus)=>{
        io.to(groupName).emit("loopSound", fileNo, loopStatus);
    });

    //same for stopping sounds
    socket.on("stop", (group,fileNo)=>{
        if(group == "all"){
            io.emit("stopAll");
        }else{
            io.to(group).emit("stop",fileNo);
        }
    });
});

//just to know that the server is working
console.log("listening on 8080...");