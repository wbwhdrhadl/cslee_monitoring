from pydantic import BaseModel
from datetime import date, datetime

class keyword(BaseModel):
    user_id: str
    site_name: str
    keyword: str
