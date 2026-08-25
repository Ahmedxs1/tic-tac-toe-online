from fastapi import FastAPI 
from routes.game import router as game_ws_router
from routes.parties import router as parties_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3333"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(game_ws_router)
app.include_router(parties_router)

@app.get("/")
def root():
    return {
        "message": "Hello From root",
        "info": "this is a tic-tac-toe online server"
    }
