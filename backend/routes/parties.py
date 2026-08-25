from fastapi import APIRouter
from schemas.parties import PartyResponse
from services.party_manager import generate_party_key , parties
from services.game import Game

router = APIRouter(prefix="/game/parties")


@router.post("/create", response_model=PartyResponse)
def create_party():
    key = generate_party_key()
    parties[key] = Game()
    print( "number of parties = " + str(len(parties)))
    return PartyResponse(party_key=key)
     