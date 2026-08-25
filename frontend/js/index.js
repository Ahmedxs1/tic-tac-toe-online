import {generatePartyKey} from "./api.js"

// check for player name in localStorage
const playerName = localStorage.getItem("playerName");
if (!playerName){
    window.location.href = "login.html"
}else{
    init();
}


function init(){
    document.getElementById("player-name").innerHTML += "<mark>" +  playerName + "</mark>"
    const partyKeyField = document.getElementById("generated-party-key");

    document.getElementById("changename-btn").addEventListener("click", () => {
        localStorage.removeItem("playerName");
        window.location.href = "login.html"
        
    });


    document.getElementById("generate-party-key-btn").addEventListener("click", async () => {
        if (partyKeyField.value != "") {
            alert("party key already generated")
            return
        };
        const partyKey = await generatePartyKey();
        partyKeyField.value = partyKey;
    });

    document.getElementById("copy-party-key-btn").addEventListener("click", async () => {
        const partyKey = partyKeyField.value;
        if (partyKey == ""){
            alert("Generate a key first");
            return;
        } 

        try{
            await navigator.clipboard.writeText(partyKey);
            console.log("Clipboard copied text " + partyKey)
            alert("Party key copied");

        }catch (error){
            console.error('Failed to copy text:', error);
        }
    });

    document.getElementById("join-party-key-btn").addEventListener("click", () => {
        const partyKey = document.getElementById("join-party-key").value.trim().toUpperCase();
        if (partyKey.length != 6){
            alert("invalid party key");
            return;
        }

        localStorage.setItem("partyKey", partyKey);
        window.location.href = "/game.html"


    });

}

