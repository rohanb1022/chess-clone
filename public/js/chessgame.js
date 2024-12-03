const socket = io();
const chess = new Chess();

const boardElement = document.querySelector(".chessBoard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = new chess.board();    
    boardElement.innerHTML = "";
    board.forEach((row , rowIndex) => {
        row.forEach((square , squareIndex) => {
            const squareElement = document.createElement("div");           
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if(square){
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );
                pieceElement.innerText = getpieceUniCode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart" , (e) => {
                    if(pieceElement.draggable){
                        draggedPiece = pieceElement;
                        sourceSquare = {row : rowIndex ,col : squareIndex};
                        e.dataTransfer.setData("text/plain" ,"");
                    }
                });

                pieceElement.addEventListener("dragend" ,(e) => {
                    draggedPiece = null;  
                    sourceSquare = null;
                });
                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover" , (e) => {
                e.preventDefault();
            })

            squareElement.addEventListener("drop" , (e) => {
                e.preventDefault();
                if(draggedPiece){
                    const targetSource = {
                        row : parseInt(squareElement.dataset.row),
                        col : parseInt(squareElement.dataset.col),
                    };
                    handleMove(sourceSquare , targetSource);
                }
            });
            boardElement.appendChild(squareElement);
        })
    });
};

const handleMove = (source , target) => {
    const move = {
        from : `${String.fromCharCode(97+source.col)}${8 - source.row}`,
        to : `${String.fromCharCode(97+target.col)}${8 - target.row}`,
        progress :"q" ,
    }

    socket.emit("move" , move);

};

const getpieceUniCode = (piece) => {
    const unicodesPieces = {
        p : "♟", 
        r : "♜",
        n : "♞",
        b : "♝",
        q : "♛",
        k : "♚",
        P : "♙",
        R : "♖",
        N : "♘",
        B : "♗",
        Q : "♕",
        K : "♔",
    }
    return unicodesPieces[piece.type] || "" ;
};

socket.on("playerRole" , function(role) {
    playerRole = role;
    renderBoard();
});

socket.on("spectatorRole" , function(role) {
    playerRole = null;
    renderBoard();
});

socket.on("boardState" , function(fen) {
    chess.load(fen);
    renderBoard();
});

socket.on("move" , function(move) {
    chess.move(move);
    renderBoard();
});



renderBoard();


//socket.emit("churan");

// socket.on("churan papadi" , function(){
//     console.log("Zalaaa babaa ekdach connection!!");
// })

// socket.on("mela toh!!!" , function(){
//     console.log("bhay toh mela bagh tikde!!!!");
// })