from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from sqlalchemy import Column, Integer, String, Float, DateTime

class FavoriteResult(Base):
    __tablename__ = "favorite_results"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)  
    user_id = Column(String(50), nullable=False)  
    site_name = Column(String, nullable=True)
    keyword = Column(String, nullable=True)
    category = Column(String, nullable=True)
    task = Column(String, nullable=True)
    announcement_date = Column(String, nullable=True)
    title = Column(String, nullable=False)
    agency = Column(String, nullable=True)
    deadline = Column(String, nullable=True)
    budget = Column(Integer, nullable=True)
    contract_method = Column(String, nullable=True)
    url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)  


