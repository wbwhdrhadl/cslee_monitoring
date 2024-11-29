from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
from .database import Base

class Department(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True) 
    name = Column(String(50), unique=True, nullable=False) 
    password = Column(String(100), nullable=False)  
