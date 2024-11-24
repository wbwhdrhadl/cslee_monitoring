from pydantic import BaseModel
from datetime import date, datetime

class keyword(BaseModel):
    key_id: int
    user_id: str
    site_name: str
    keyword: str
    start_date: date
    end_date: date
