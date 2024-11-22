from pydantic import BaseModel
from datetime import date, datetime

class SearchResultCreate(BaseModel):
    user_id: str
    site_name: str
    keyword: str
    category: str
    task: str
    type: str
    announcement_date: date
    title: str
    agency: str
    deadline: datetime
    budget: str
    contract_method: str
    url: str
