from services.game import Game
import asyncio


parties: dict[str, Game] = {}



import secrets
import string

def generate_party_key():
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(6))


async def delete_party(key: str, game: Game):
    await asyncio.sleep(1.5)

    # Check AGAIN after 1 second
    if key in parties and not game.players:
        del parties[key]

        print(f"Party {key} deleted")
        print(f"number of parties = {len(parties)}")