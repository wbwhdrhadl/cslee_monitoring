from pydantic import BaseModel
from datetime import datetime

class FavoriteCreate(BaseModel):
    id: int
    user_id: str
    site_name: str
    keyword: str
    category: str
    task: str
    announcement_date: str
    title: str
    agency: str
    deadline: datetime
    budget: int
    contract_method: str
    url: str

    class Config:
        orm_mode = True 
