from fastapi import FastAPI 
from routes.game import router as game_ws_router

app = FastAPI()

app.include_router(game_ws_router)

@app.get("/")
def root():
    return {
        "message": "Hello From root",
        "info": "this is a tic-tac-toe online server"
    }
