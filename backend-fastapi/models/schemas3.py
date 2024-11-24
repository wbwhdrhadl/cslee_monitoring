from pydantic import BaseModel, validator
from typing import List
from decimal import Decimal
from datetime import datetime

class SearchResultBase(BaseModel):
    user_id: str
    site_name: str
    keyword: str
    category: str
    task: str
    type: str
    announcement_date: datetime
    title: str
    agency: str
    deadline: datetime
    budget: float  # float 타입으로 정의
    contract_method: str
    url: str

    @validator('budget', pre=True)
    def parse_budget(cls, value):
        if isinstance(value, str):
            # 쉼표와 '원' 기호를 제거하고 숫자만 남기기
            value = value.replace(',', '').replace('원', '').strip()
        try:
            return float(value)
        except ValueError:
            raise ValueError('Invalid budget format, should be a valid number')
    
    class Config:
        orm_mode = True  # SQLAlchemy 모델과의 호환을 위해 설정
