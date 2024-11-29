from sqlalchemy import Column, Integer, String, Date, DateTime, Text
from .database import Base
from datetime import datetime

class KeywordResult(Base):
    __tablename__ = "keywordtable"

    key_id = Column(Integer, primary_key=True, index=True, autoincrement=True) 
    user_id = Column(String(50), nullable=False)  
    site_name = Column(String(100), nullable=False)  
    keyword = Column(String(100), nullable=False) 
    # start_date = Column(Date, nullable=False) 
    # end_date = Column(Date, nullable=False)  
    # date_interval = Column(Integer, nullable=False) 
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)  