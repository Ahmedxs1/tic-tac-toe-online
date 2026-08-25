const partyKeyField = document.getElementById("party-key");
const cells = document.getElementsByClassName("game-cell");
let currentPlayer;
let me;
let ws;

const playerChar = document.getElementById("player-char");
const turnStatus = document.getElementById("turn-status");
const gameContainer = document.getElementById("game-container");
const playerName = localStorage.getItem("playerName");

const partyKey = localStorage.getItem("partyKey");
if (!partyKey){
    window.location.href = "index.html";
    
}else{

    console.log("party key = " + partyKey)
    
    const isLocal = window.location.hostname === "127.0.0.1";

    const wsUrl = isLocal
        ? `ws://127.0.0.1:2222/game/ws/${partyKey}/${playerName}`
        : `wss://${window.location.host}/game/ws/${partyKey}/${playerName}`;

    ws = new WebSocket(wsUrl);
    
    
    
    main();
}



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
    
    const playerName = localStorage.getItem("playerName");
    if (!playerName){
        window.location.href = "login.html"
        return;
    }
    document.getElementById("player-name").innerHTML += "<mark>" +  playerName + "</mark>"
    
    partyKeyField.value = partyKey

    document.getElementById("copy-party-key-btn").addEventListener("click", async () => {
        try{
            await navigator.clipboard.writeText(partyKey);
            console.log("Clipboard copied text " + partyKey)
            alert("Party key copied");

        }catch (error){
            console.error('Failed to copy text:', error);
        }
    });
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
            return;
        }
        if (data.type == "oponent-name"){
            displayOponentName(data.content);
            return;
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

function displayOponentName(names){
    for (const name of names){
        if (name != localStorage.getItem("playerName")){
            document.getElementById("player-name").innerHTML += ` VS <mark>${name}</mark>`
        }
    }
}