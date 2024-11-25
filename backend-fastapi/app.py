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
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 필요한 경우 ["http://192.168.0.4:8000"]와 같이 특정 도메인으로 제한 가능
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


################### 회원 정보 ###################
# 부서 인증
@app.post("/departments_auth/")
def authenticate_user(department_name: str, password: str, db: Session = Depends(get_db)):
    department = db.query(Department).filter(Department.name == department_name).first()

    if not department:
        raise HTTPException(status_code=404, detail="부서를 찾을 수 없습니다.")
    
    if department.password != password:
        raise HTTPException(status_code=401, detail="비밀번호가 올바르지 않습니다.")

    return {"message": f"환영합니다, {department_name} 부서!"}

# 부서 추가
@app.post("/departments_add/")
def create_department(name: str, password: str, db: Session = Depends(get_db)):
    try:
        new_department = Department(name=name, password=password)
        db.add(new_department)
        db.commit()
        db.refresh(new_department)
        return {"message": f"부서 '{new_department.name}'가 성공적으로 생성되었습니다."}
    except Exception as e:
        # JSON 형식의 HTTP 응답 반환
        return JSONResponse(
            status_code=400,
            content={"detail": f"에러 발생: {str(e)}"}
        )

# 부서 삭제
@app.delete("/departments_delete/")
def delete_department(department_name: str, password: str, db: Session = Depends(get_db)):
    # 부서 이름과 비밀번호를 기준으로 부서 검색
    department_to_delete = db.query(Department).filter(
        Department.name == department_name,
        Department.password == password
    ).first()

    if not department_to_delete:
        raise HTTPException(status_code=404, detail="부서 이름 또는 비밀번호가 올바르지 않습니다.")

    # 부서 삭제
    db.delete(department_to_delete)
    db.commit()

    return {"message": f"부서 '{department_name}'가 성공적으로 삭제되었습니다."}

# 부서 비밀번호 수정
@app.put("/departments_update_password/")
def update_department_password(
    name: str, 
    current_password: str, 
    new_password: str, 
    db: Session = Depends(get_db)
):
    # 부서 검색
    department_to_update = db.query(Department).filter(Department.name == name).first()

    if not department_to_update:
        raise HTTPException(status_code=404, detail="해당 부서를 찾을 수 없습니다.")
    
    # 현재 비밀번호 확인
    if department_to_update.password != current_password:
        raise HTTPException(status_code=400, detail="현재 비밀번호가 올바르지 않습니다.")

    # 비밀번호 변경
    department_to_update.password = new_password

    db.commit()
    db.refresh(department_to_update)

    return {"message": f"부서 '{department_to_update.name}'의 비밀번호가 성공적으로 변경되었습니다."}

# user-id가져오기
@app.get("/get_user_id/")
def get_user_id(department_name: str, db: Session = Depends(get_db)):
    department = db.query(Department).filter(Department.name == department_name).first()

    if not department:
        raise HTTPException(status_code=404, detail="부서를 찾을 수 없습니다.")

    return {"user_id": department.user_id}
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
    # 새로운 키워드 데이터베이스에 추가
    new_result_keyword = KeywordResult(
        user_id=result.user_id,
        site_name=result.site_name,
        keyword=result.keyword,
        created_at=datetime.utcnow(),
    )
    db.add(new_result_keyword)
    db.commit()
    db.refresh(new_result_keyword)
    return {"message": "키워드가 성공적으로 추가되었습니다.", "data": new_result_keyword}

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
    site_names: List[str],
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

    print(results)

    if not results:
        raise HTTPException(status_code=404, detail="일치하는 데이터를 찾을 수 없습니다.")

    return results

@app.get("/keywords/")
def get_keywords(user_id: str, db: Session = Depends(get_db)):
    keywords = db.query(KeywordResult).filter(KeywordResult.user_id == user_id).all()
    return [
        {"site_name": keyword.site_name, "keyword": keyword.keyword}
        for keyword in keywords
    ]