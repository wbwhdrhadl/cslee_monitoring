from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.database import engine, Base, get_db
from models.result_model import SearchResult
from models.keyword_model import KeywordResult
from models.schemas import SearchResultCreate
from models.schemas2 import keyword
from datetime import datetime
from typing import List

app = FastAPI()

Base.metadata.create_all(bind=engine)

# 결과 DB 삽입
@app.post("/results_add/")
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

# 키워드 추가
@app.post("/keyword_add/")
def add_keyword(result: keyword, db: Session = Depends(get_db)):
    date_interval = (result.end_date - result.start_date).days  # .days로 일수 차이를 계산
    new_result_keyword = KeywordResult(
        key_id=result.key_id,
        user_id=result.user_id,
        site_name=result.site_name,
        keyword=result.keyword,
        start_date=result.start_date,
        end_date=result.end_date,
        date_interval=date_interval,  # 계산된 date_interval을 삽입
        created_at=datetime.utcnow(),
    )
    db.add(new_result_keyword)
    db.commit()
    db.refresh(new_result_keyword)
    return new_result_keyword

# 키워드 삭제
@app.delete("/keyword_delete/")
def delete_keyword(delete_data: keyword, db: Session = Depends(get_db)):
    deleted = db.query(KeywordResult).filter(
        KeywordResult.user_id == delete_data.user_id,
        KeywordResult.site_name == delete_data.site_name,
        KeywordResult.keyword == delete_data.keyword
    ).delete(synchronize_session=False) 

    db.commit()

    if deleted:
        return {"message": "키워드가 성공적으로 삭제되었습니다."}
    else:
        raise HTTPException(status_code=404, detail="해당 키워드를 찾을 수 없습니다.")
