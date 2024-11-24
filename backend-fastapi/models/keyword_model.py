from sqlalchemy import Column, Integer, String, Date, DateTime, Text
from .database import Base
from datetime import datetime

class KeywordResult(Base):
    __tablename__ = "keywordtable"

    key_id = Column(Integer, primary_key=True, index=True)  # 고유 식별자
    user_id = Column(String(50), nullable=False)  # 사용자 ID
    site_name = Column(String(100), nullable=False)  # 사이트 이름
    keyword = Column(String(100), nullable=False)  # 검색된 키워드
    start_date = Column(Date, nullable=False)  # 시작날짜
    end_date = Column(Date, nullable=False)  # 종료 날짜
    date_interval = Column(Integer, nullable=False)  # 수정된 부분: GENERATED 제거
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)  # 저장 시간