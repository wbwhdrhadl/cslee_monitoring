from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
from .database import Base

class Department(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # 자동 생성
    name = Column(String(50), unique=True, nullable=False)  # 부서 이름
    password = Column(String(100), nullable=False)  # 부서 비밀번호
