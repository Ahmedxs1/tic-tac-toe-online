from fastapi import APIRouter , WebSocket , WebSocketDisconnect
from services.party_manager import parties , delete_party

router = APIRouter(prefix="/game")



@router.websocket("/ws/{party_key}/{player_name}")
async def websocket_endpoint(ws: WebSocket, party_key: str, player_name: str):
    print(f"number of parties = {len(parties)}")
    game = parties.get(party_key)
    if game is None:
        await ws.accept()
        await  ws.send_json({
            "type": "rejection",
            "content": "Party not found"
        })
        await ws.close()
        return
    
    connected = await game.connect(ws, player_name)
    if not connected:
        return

    await game.broadcast_oponent_name()

    try:
        while True:
            event = await ws.receive_json()
            await game.handleEvenet(event, ws)

    except WebSocketDisconnect:
        await game.disconnect(ws)
        if not game.players:
            await delete_party(party_key, game)

        # TODO handle party auto-close when disconnect and game.player is empty  
        # means last player leaved so delete party from parties list

