from sqlalchemy import Column, Integer, String, Date, DateTime, Text
from .database import Base
from datetime import datetime

class SearchResult(Base):
    __tablename__ = "search_results"

    id = Column(Integer, primary_key=True, index=True)  # 고유 식별자
    user_id = Column(String(50), nullable=False)  # 사용자 ID
    site_name = Column(String(100), nullable=False)  # 사이트 이름
    keyword = Column(String(100), nullable=False)  # 검색된 키워드
    category = Column(String(50), nullable=False)  # 구분
    task = Column(String(50), nullable=False)  # 업무
    type = Column(String(50), nullable=False)  # 분류
    announcement_date = Column(Date, nullable=False)  # 공고일
    title = Column(String(255), nullable=False)  # 공고명
    agency = Column(String(255), nullable=False)  # 공고 기관
    deadline = Column(DateTime, nullable=False)  # 마감일시
    budget = Column(String(50), nullable=False)  # 사업 예산
    contract_method = Column(String(100), nullable=False)  # 계약 방법
    url = Column(Text, nullable=False)  # 공고문 URL
    saved_at = Column(DateTime, nullable=False, default=datetime.utcnow)  # 저장 시간
