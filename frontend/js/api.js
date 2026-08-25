export async function generatePartyKey(){

    try{
        const response = await fetch("http://127.0.0.1:2222/parties/create", {
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