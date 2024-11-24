from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.database import engine, Base, get_db
from models.result_model import SearchResult
from models.keyword_model import KeywordResult
from models.department_model import Department
from models.schemas import SearchResultCreate
from models.schemas2 import keyword
from models.schemas3 import SearchResultBase
from models.schemas4 import UserResult
from datetime import datetime
from typing import List
from fastapi import HTTPException, status

app = FastAPI()

Base.metadata.create_all(bind=engine)


################### 회원 정보 ###################
# 부서 추가
@app.post("/departments_add/")
def create_department(result: UserResult, db: Session = Depends(get_db)):
    new_department = Department(
        user_id=result.user_id,
        name=result.name,
        password=result.password
    )
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    return new_department

# 부서 삭제
@app.delete("/departments_delete/")
def delete_department(department_name: str, db: Session = Depends(get_db)):
    # 부서 이름을 기준으로 부서 삭제
    deleted = db.query(Department).filter(Department.name == department_name).delete(synchronize_session=False)

    db.commit()

    if deleted:
        return {"message": f"부서 '{department_name}'가 성공적으로 삭제되었습니다."}
    else:
        raise HTTPException(status_code=404, detail="해당 부서를 찾을 수 없습니다.")

# 부서 비밀번호 수정
@app.put("/departments_update_password/")
def update_department_password(name: str, new_password: str, db: Session = Depends(get_db)):
    # 해당 user_id로 부서 검색
    department_to_update = db.query(Department).filter(Department.name == name).first()

    if not department_to_update:
        raise HTTPException(status_code=404, detail="해당 부서를 찾을 수 없습니다.")
    
    department_to_update.password = new_password

    db.commit()
    db.refresh(department_to_update)

    return {"message": f"부서 '{department_to_update.name}'의 비밀번호가 성공적으로 변경되었습니다."}

################################################


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
    date_interval = (result.end_date - result.start_date).days  
    new_result_keyword = KeywordResult(
        key_id=result.key_id,
        user_id=result.user_id,
        site_name=result.site_name,
        keyword=result.keyword,
        start_date=result.start_date,
        end_date=result.end_date,
        date_interval=date_interval,  
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


# 조회 API - user_id, 키워드, 사이트, 시작날짜, 종료날짜로 검색
@app.post("/search_results/", response_model=List[SearchResultBase])
def get_search_results(
    user_id: str, 
    keywords: List[str],  
    start_date: datetime, 
    end_date: datetime,
    db: Session = Depends(get_db)
):
    # SQLAlchemy 쿼리로 조건에 맞는 데이터 조회
    results = db.query(SearchResult).filter(
        SearchResult.user_id == user_id,  
        SearchResult.keyword.in_(keywords),  
        SearchResult.site_name.in_(site_names),  
        SearchResult.announcement_date.between(start_date, end_date) 
    ).all()

    if not results:
        raise HTTPException(status_code=404, detail="일치하는 데이터를 찾을 수 없습니다.")

    return results
