from pydantic import BaseModel

class UserResult(BaseModel):  
    name: str
    password: str
