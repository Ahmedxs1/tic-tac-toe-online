from fastapi import APIRouter , WebSocket , WebSocketDisconnect
from services.game import Game

router = APIRouter(prefix="/game")
game = Game()

@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    
    con =  await game.connect(ws)
    if not con:
        return


    try:
        while True:
            data = await ws.receive_json()
            await game.handleEvenet(data, ws)
            
    except WebSocketDisconnect:
        await game.disconnect(ws)
        print("Client disconnected.")


