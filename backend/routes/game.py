from fastapi import APIRouter , WebSocket , WebSocketDisconnect
from services.party_manager import parties

router = APIRouter(prefix="/game")

@router.websocket("/ws/{party_key}")
async def websocket_endpoint(ws: WebSocket, party_key: str):
    
    game = parties.get(party_key)
    if game is None:
        await ws.accept()
        await  ws.send_json({
            "type": "rejection",
            "content": "Party not found"
        })
        await ws.close()
        return
    
    connected = await game.connect(ws)
    if not connected:
        return

    try:
        while True:
            event = await ws.receive_json()
            await game.handleEvenet(event, ws)

    except WebSocketDisconnect:
        await game.disconnect(ws)

