const express = require("express");
const socket = require("socket.io");
const http = require("http");
const {Chess} = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io  = socket(server);

const chess = new Chess();

let players = {};
let currentPlayer = "w";

app.set("view engine" , "ejs");
app.use(express.static(path.join(__dirname , 'public')));

app.get("/" , (req , res) => {
    res.render("index" , {title : "Chess Game"});
})

// How the system will work in socket?
// answer =>  first this is our backend waala js so jab koi bhi halchal hogi frontend pe ya fir simple bhash me bolu toh agar koi bhi user connect hoga frontend se hoga right toh vahase backend pe reqwuest aayega 
// vo receive karega yahape jahape hamne connection wala function banaya hai ye io.on receive karega aur log se print karega to make sure 

// abhi hamara backend wala js kuch toh bhejega frontend pe aisa kyu bhejega jabhi ham what's app pe agar koi naya admi join hota hai toh hame notification milta hai toh vo jaruri hai ki hamara backend bhi kuch toh bheje

// abhi ye backend kaise bhejega vo aise ki hamare pass jo uniquesocket hai uski madat se ham communicate kar skte hai

// hamne uniquesocket.on me agar churan event receive hota hai toh uske upar hame ek aur function karte hai abhi vo sirf usi client ko bhejna hai toh ham io.emit ke jaga uniquesocket.io likhte toh sirf specific client ko hi receive hota aur io.emit ki madat se sabko receive hota hai


// this is for connection when any user joined it will print user connected succesfully
// io.on("connection" , function(uniquesocket){
//     console.log("User connected successfully");

//     uniquesocket.on("churan" , function(){
//         io.emit("churan papadi");        
//     })
    // when user disconnects
//     uniquesocket.on("disconnect" , function(){
//         console.log("user disconnected");
//         io.emit("mela toh!!!");
//     })
// })

io.on("connection" , function(uniquesocket){
    console.log("User Connected");
    
    if(!players.white){
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole" , "w");
    }else if(!players.black){
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole" , "b");
    }else{
        uniquesocket.emit("spectatorRole");
    }

    uniquesocket.on("disconnect" , function(){
        if(uniquesocket.id === players.white){
            delete players.white;
        }else if(uniquesocket.id === players.black){
            delete players.black;
        }
    });

    uniquesocket.on("move" , (move) => {
        try {
            if(chess.turn() === "w" && uniquesocket.id !== players.white) return;
            if(chess.turn() === "b" && uniquesocket.id !== players.black) return;  
            
            const result = chess.move(move);
            if(result){
                currentPlayer = chess.turn();
                io.emit("move" , move);
                io.emit("boardState" , chess.fen());
            }else{
                console.log("Invalid Move" , move);
                uniquesocket.emit("invalidMove" , move);
            }
        } catch (error) {
            console.log("Some Error occurred" , error);
            uniquesocket.emit("Invalid Move" , move);
        }
        
    }) 
})


server.listen(3000 , function(){
    console.log("app is listening to you asshole");
})