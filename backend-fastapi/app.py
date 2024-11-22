from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import SearchResult
from schemas import SearchResultCreate
from datetime import datetime

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.post("/results/")
def create_search_result(result: SearchResultCreate, db: Session = Depends(get_db)):
    new_result = SearchResult(
        user_id=result.user_id,
        site_name=result.site_name,
        keyword=result.keyword,
        category=result.category,
        task=result.task,
        type=result.type,
        announcement_date=result.announcement_date,
        title=result.title,
        agency=result.agency,
        deadline=result.deadline,
        budget=result.budget,
        contract_method=result.contract_method,
        url=result.url,
        saved_at=datetime.utcnow(),
    )
    db.add(new_result)
    db.commit()
    db.refresh(new_result)
    return new_result
