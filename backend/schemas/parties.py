from pydantic import BaseModel , Field



class PartyResponse(BaseModel):
    party_key: str = Field(...)