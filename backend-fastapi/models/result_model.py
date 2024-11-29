from sqlalchemy import Column, Integer, String, Date, DateTime, Text
from .database import Base
from datetime import datetime

class SearchResult(Base):
    __tablename__ = "search_results"

    id = Column(Integer, primary_key=True, index=True)   
    user_id = Column(String(50), nullable=False)  
    site_name = Column(String(100), nullable=False)  
    keyword = Column(String(100), nullable=False)  
    category = Column(String(50), nullable=False)  
    task = Column(String(50), nullable=False)  
    type = Column(String(50), nullable=False)  
    announcement_date = Column(Date, nullable=False)  
    title = Column(String(255), nullable=False)   
    agency = Column(String(255), nullable=False)  
    deadline = Column(DateTime, nullable=False)  
    budget = Column(String(50), nullable=False)   
    contract_method = Column(String(100), nullable=False)   
    url = Column(Text, nullable=False)   
    saved_at = Column(DateTime, nullable=False, default=datetime.utcnow)  
