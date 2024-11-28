from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class FavoriteResult(Base):
    __tablename__ = "favorite_results"

    id = Column(Integer, primary_key= True, nullable=False)  # 고유 식별자, 자동 증가
    user_id = Column(String(50), nullable=False)  # 사용자 ID
    site_name = Column(String(100), nullable=False)  # 구분
    keyword = Column(String(100), nullable=False)  # 검색 키워드
    category = Column(String(50), nullable=False)  # 분류
    task = Column(String(50), nullable=False)  # 업무
    announcement_date = Column(String(50), nullable=False)  # 공고일
    title = Column(String(255), nullable=False)  # 제목
    agency = Column(String(255), nullable=False)  # 공고기관
    deadline = Column(String(50), nullable=False)  # 마감일시
    budget = Column(Integer, nullable=False)  # 예산
    contract_method = Column(String(100), nullable=False)  # 계약 방법
    url = Column(String, nullable=False)  # 공고문 URL
    created_at = Column(DateTime, default=datetime.utcnow)  # 즐겨찾기 추가 시간
