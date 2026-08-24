// declaration

const ws = new WebSocket(
    window.location.hostname === "127.0.0.1"
        ? "ws://127.0.0.1:2222/game/ws"
        : `wss://${window.location.host}/game/ws`
);

const cells = document.getElementsByClassName("game-cell");
let currentPlayer;
let me;

const playerChar = document.getElementById("player-char");
const turnStatus = document.getElementById("turn-status");
const gameContainer = document.getElementById("game-container");

function updateTurnStatus(currentPlayer) {

    if (!me) {
        return;
    }
    
    playerChar.textContent = me

    if (currentPlayer === me) {
        turnStatus.textContent = "Your turn";
        gameContainer.classList.add("my-turn");
        gameContainer.classList.remove("not-my-turn");
    } else {
        turnStatus.textContent = "Opponent's turn";
        gameContainer.classList.add("not-my-turn");
        gameContainer.classList.remove("my-turn");
    }
}

function initGame(){
    console.log("initGame")
    for (const cell of cells) {
        cell.textContent = "";
        cell.addEventListener("click", () => {
            handleCellClick(cell);
        })
    }
    
}

function handleCellClick(cell){
    ws.send(JSON.stringify({
        type: "play",
        index: cell.id,
    }))
}



function main(){
    initGame();

    ws.addEventListener('open', (event) => {
        console.log('Connected to the Webws server.');
    
        ws.send(JSON.stringify({
            type: "infoMe",
        }))
    })
    ws.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
    
        if (data.type == "meInfo"){
            me = data.content;
            return
        }
        if (data.type == "gameStateUpdate"){
            console.log("gameStateUpdate")
            updateBoard(data.board) 

            updateTurnStatus(data.currentPlayer);
            return;
        }
        if (data.type == "win") {
            setTimeout(() => {
                alert(data.content + " has won");
            }, 1000);
            return;
        }

        if (data.type == "tie") {
            setTimeout(() => {
                alert(data.content);
            }, 1000);
            return;
        }       
        if (data.type == "alert"){
            alert(data.content);
            return
        }
        if (data.type == "rejection"){
            alert(data.content)
        }

    });
    
    ws.addEventListener('error', (event) => {
        console.error('Webws error observed:', event);
    });
    
    ws.addEventListener('close', (event) => {
        console.log(`Connection closed. Code: ${event.code}, Reason: ${event.reason}`);
    });
    
}

function updateBoard(board){
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            cells[i * 3 + j].textContent = board[i][j]
        }
    }
}

// program entry
main();