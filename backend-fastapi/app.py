from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.database import engine, Base, get_db
from models.result_model import SearchResult
from models.favorite import FavoriteResult
from models.keyword_model import KeywordResult
from models.department_model import Department
from models.schemas import SearchResultCreate
from models.schemas2 import keyword
from models.schemas3 import SearchResultBase
from models.schemas4 import UserResult
from models.schemas5 import FavoriteCreate
from datetime import datetime
from typing import List
from fastapi import HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import os

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
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


@app.post("/results_add_from_excel/")
def add_results_from_excel(db: Session = Depends(get_db)):
    try:
        # Excel 파일 읽기
        file_path = "./나라장터.xlsx"
        df = pd.read_excel(file_path)

        added_count = 0  

        for _, row in df.iterrows():
            user_id = "1" 
            site_name = row["구분"] if pd.notna(row["구분"]) else "알 수 없음"
            keyword = row["검색 키워드"] if pd.notna(row["검색 키워드"]) else "알 수 없음"
            category = row["비고"] if pd.notna(row["비고"]) else "알 수 없음"
            task = row["업무"] if pd.notna(row["업무"]) else "알 수 없음"
            type_ = row["분류"] if pd.notna(row["분류"]) else "알 수 없음"

            # 날짜 데이터 처리
            try:
                announcement_date = (
                    datetime.strptime(row["공고일"], "%Y-%m-%d").date()
                    if pd.notna(row["공고일"]) and row["공고일"] != "-"
                    else datetime.utcnow().date()  
                )
            except (ValueError, TypeError):
                announcement_date = datetime.utcnow().date() 

            try:
                deadline = (
                    datetime.strptime(row["마감일시"], "%Y-%m-%d %H:%M")
                    if pd.notna(row["마감일시"]) and row["마감일시"] not in ["-", "0000-00-00"]
                    else datetime.utcnow()  
                )
            except (ValueError, TypeError):
                deadline = datetime.utcnow() 

            title = row["공고명"] if pd.notna(row["공고명"]) else "제목 없음"
            agency = row["공고기관"] if pd.notna(row["공고기관"]) else "알 수 없음"

            budget = row["사업예산"].replace(",", "").replace("원", "").strip() if pd.notna(row["사업예산"]) else "0"

            contract_method = row["계약방법"] if pd.notna(row["계약방법"]) else "알 수 없음"
            url = row["공고문 url"] if pd.notna(row["공고문 url"]) else ""

            existing_result = db.query(SearchResult).filter(SearchResult.title == title).first()
            if existing_result:
                continue

            # 새 데이터 생성 및 삽입
            new_result = SearchResult(
                user_id=user_id,
                site_name=site_name,
                keyword=keyword,
                category=category,
                task=task,
                type=type_,
                announcement_date=announcement_date,
                title=title,
                agency=agency,
                deadline=deadline,
                budget=budget,
                contract_method=contract_method,
                url=url,
                saved_at=datetime.utcnow(),
            )
            db.add(new_result)
            added_count += 1

        db.commit()

        os.remove(file_path)

        return {"message": f"{added_count}개의 고유한 결과가 성공적으로 추가되었으며, 파일이 삭제되었습니다."}

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Excel 파일을 찾을 수 없습니다.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"에러가 발생했습니다: {str(e)}")
# 키워드 추가
@app.post("/keyword_add/")
def add_keyword(result: keyword, db: Session = Depends(get_db)):
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

# 즐겨찾기 추가
@app.post("/favorites/add/")
def add_favorite(favorite_data: FavoriteCreate, db: Session = Depends(get_db)):
    """
    즐겨찾기 항목 추가
    """
    try:
      
        existing_favorite = db.query(FavoriteResult).filter(
            FavoriteResult.user_id == favorite_data.user_id,
            FavoriteResult.title == favorite_data.title
        ).first()

        if existing_favorite:
            raise HTTPException(status_code=400, detail="이미 즐겨찾기에 추가된 항목입니다.")

        new_favorite = FavoriteResult(
            user_id=favorite_data.user_id,
            site_name=favorite_data.site_name,
            keyword=favorite_data.keyword,
            category=favorite_data.category,
            task=favorite_data.task,
            announcement_date=favorite_data.announcement_date,
            title=favorite_data.title,
            agency=favorite_data.agency,
            deadline=favorite_data.deadline,
            budget=favorite_data.budget,
            contract_method=favorite_data.contract_method,
            url=favorite_data.url,
            created_at=datetime.utcnow(),
        )
        db.add(new_favorite)
        db.commit()
        db.refresh(new_favorite)

        return {"message": "즐겨찾기에 성공적으로 추가되었습니다.", "data": new_favorite}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"에러 발생: {str(e)}")

# 즐겨찾기 삭제
@app.delete("/favorites/delete/")
def delete_favorite(user_id: str, title: str, db: Session = Depends(get_db)):
    """
    즐겨찾기 항목 삭제
    """
    try:
        print(f"Received user_id: {user_id}, title: {title}")  

        deleted_count = db.query(FavoriteResult).filter(
            FavoriteResult.user_id == user_id,
            FavoriteResult.title == title.strip()  
        ).delete(synchronize_session=False)

        if deleted_count == 0:
            raise HTTPException(status_code=404, detail="해당 즐겨찾기 항목을 찾을 수 없습니다.")

        db.commit()
        return {"message": "즐겨찾기에서 성공적으로 삭제되었습니다."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"에러 발생: {str(e)}")

# 즐겨찾기 조회
@app.get("/favorites/")
def get_favorites(user_id: str, db: Session = Depends(get_db)):
    """
    사용자별 즐겨찾기 조회
    """
    try:

        favorites = db.query(FavoriteResult).filter(FavoriteResult.user_id == user_id).all()

        if not favorites:
            raise HTTPException(status_code=404, detail="즐겨찾기 항목이 없습니다.")

        return [
            {
                "id": favorite.id,
                "site_name": favorite.site_name,
                "keyword": favorite.keyword,
                "category": favorite.category,
                "task": favorite.task,
                "announcement_date": favorite.announcement_date,
                "title": favorite.title,
                "agency": favorite.agency,
                "deadline": favorite.deadline,
                "budget": favorite.budget,
                "contract_method": favorite.contract_method,
                "url": favorite.url,
                "created_at": favorite.created_at,
            }
            for favorite in favorites
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"에러 발생: {str(e)}")