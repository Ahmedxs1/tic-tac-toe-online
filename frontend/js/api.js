export async function generatePartyKey(){

    const isLocal = window.location.hostname === "127.0.0.1";

    const API_URL = isLocal
        ? "http://127.0.0.1:2222"
        : "";

    try {
        const response = await fetch(`${API_URL}/game/parties/create`, {
            method: "POST"
        });


        if (!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.party_key;

    }catch (error){
        console.log(error)
    }

}