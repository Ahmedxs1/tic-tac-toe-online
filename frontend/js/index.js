import {generatePartyKey} from "./api.js"


main();

function main(){
    const playerName = localStorage.getItem("playerName");
    if (!playerName){
        window.location.href = "login.html"
        return;
    }
    document.getElementById("player-name").innerHTML += "<mark>" +  playerName + "</mark>"

    document.getElementById("changename-btn").addEventListener("click", () => {
        localStorage.removeItem("playerName");
        window.location.href = "login.html"
        
    });


    document.getElementById("generate-party-key-btn").addEventListener("click", async () => {
        const partyKey = await generatePartyKey();
        if (!partyKey){
            alert("coudnt generate a party key");
            return;
        }

        localStorage.setItem("partyKey", partyKey)
        window.location.href = "game.html"
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

