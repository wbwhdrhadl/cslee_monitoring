from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
from .database import Base

class Department(Base):
    __tablename__ = "users"

    user_id = Column(String(50), primary_key=True, index=True)  # 부서 ID
    name = Column(String(50), unique=True, nullable=False)  # 부서 이름
    password = Column(String(100), nullable=False)  # 부서 비밀번호
