from services.game import Game


parties: dict[str, Game] = {}



import secrets
import string

def generate_party_key():
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(6))


def delete_party(key: str):
    if key in parties:
        del parties[key]
        print(f"Party {key} deleted")