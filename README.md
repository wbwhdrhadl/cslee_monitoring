### IT 정부 과제 크롤링 및 검색어 기반 결과 조회 앱 개발

- 해당 프로젝트는 **CSLEE 인턴십** 기간 동안 진행한 주요 과제로, IT 관련 정부 과제를 크롤링하여 사이트와 검색어에 맞는 결과를 제공하는 앱을 개발하였습니다.
- **주요 기능:**
  - 사이트와 검색어에 따른 맞춤형 크롤링 기능 구현
  - 크롤링된 결과 데이터를 기반으로 즐겨찾기, 키워드 관리, 부서 관리 기능 제공
  - 실시간으로 크롤링 데이터를 업데이트 및 조회 가능
- **시연 영상:**
  - 🔎 https://youtube.com/shorts/UY3pRglKPpM?feature=share

## 📂 파일 경로 정리

- 📁 `backend-fastapi` : [BACK-END]
   - 📁 crawling
       - 📁 result : 크롤링 결과가 저장되는 폴더
   - 📁 `__pycache__`
   - 📁 models : 모델 정의, 데이터 연결 폴더 모음
   - 📄 `__init__.py`
   - 📄 `app.py` : API 연결 파일
   - 📄 `crawling_later.py` : airflow 연결 파일 (크롤링 예약 실행 파일)

- 📁 `key_crawling` : [FRONT-END] 
  - 📁 `assets`
  - 📁 `pages`
    - 📄 `_layout.tsx` : 페이지 구조 관리 
    - 📄 `addnow.tsx` : 직접 실행 페이지
    - 📄 `admin.tsx` : 관리자 페이지 - 부서 정보 관리, DB 관리 페이지
    - 📄 `favorites.tsx` : 즐겨찾기 목록 페이지 - 즐겨찾기 조회 기능
    - 📄 `main.tsx` : 결과 조회 페이지 - 결과 조회 기능
    - 📄 `register.tsx` : 키워드 등록 페이지 - 사이트별 키워드 추가, 삭제 기능
    - 📄 `result.tsx` : 결과 조회 페이지 - 즐겨찾기 추가, 삭제 기능
  - 📄 `department.tsx`: 부서 관리 페이지 - 부서 추가, 삭제, 수정 기능
  - 📄 `index.tsx`: 로그인 페이지 - 로그인 인증 기능
  - 📄 `UserContext.tsx`: userId 전역변수 관리

---

## 사용 방법
1. **Backend 실행**
   - `backend-fastapi` 폴더로 이동하여 아래 명령어 실행:
     ```bash
     uvicorn app:app --host 0.0.0.0 --port [포트번호]
     ```

2. **Frontend 실행**
   - `key_crawling` 폴더로 이동하여 아래 명령어 실행:
     ```bash
     npx expo start
     ```

---

## 사용된 API 정리

### 📂 부서 관리 API
- **부서 인증**
  - **Endpoint**: `POST /departments_auth/`
  - **설명**: 부서 이름과 비밀번호로 인증
  - **Request Parameters**:
    - `department_name` (string): 부서 이름
    - `password` (string): 비밀번호
  - **Response**:
    ```json
    {
      "message": "환영합니다, [부서명] 부서!"
    }
    ```

- **부서 추가**
  - **Endpoint**: `POST /departments_add/`
  - **설명**: 새로운 부서 추가
  - **Request Parameters**:
    - `name` (string): 부서 이름
    - `password` (string): 부서 비밀번호
  - **Response**:
    ```json
    {
      "message": "부서 '[부서명]'가 성공적으로 생성되었습니다."
    }
    ```

- **부서 삭제**
  - **Endpoint**: `DELETE /departments_delete/`
  - **설명**: 부서를 삭제합니다.
  - **Request Parameters**:
    - `department_name` (string): 부서 이름
    - `password` (string): 부서 비밀번호
  - **Response**:
    ```json
    {
      "message": "부서 '[부서명]'가 성공적으로 삭제되었습니다."
    }
    ```

---

### 📂 키워드 관리 API
- **키워드 추가**
  - **Endpoint**: `POST /keyword_add/`
  - **설명**: 키워드를 추가합니다.
  - **Request Body**:
    ```json
    {
      "user_id": "[사용자 ID]",
      "site_name": "[사이트 이름]",
      "keyword": "[키워드]"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "키워드가 성공적으로 추가되었습니다."
    }
    ```

- **키워드 삭제**
  - **Endpoint**: `DELETE /keyword_delete/`
  - **설명**: 키워드를 삭제합니다.
  - **Request Body**:
    ```json
    {
      "user_id": "[사용자 ID]",
      "site_name": "[사이트 이름]",
      "keyword": "[키워드]"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "키워드가 성공적으로 삭제되었습니다."
    }
    ```

- **부서별 키워드 조회**
  - **Endpoint**: `GET /keywords/`
  - **설명**: 특정 부서의 키워드를 조회합니다.
  - **Request Parameters**:
    - `user_id` (string): 사용자 ID
  - **Response**:
    ```json
    [
      {
        "site_name": "[사이트 이름]",
        "keyword": "[키워드]"
      }
    ]
    ```

---

### 📂 즐겨찾기 관리 API
- **즐겨찾기 추가**
  - **Endpoint**: `POST /favorites/add/`
  - **설명**: 즐겨찾기 항목을 추가합니다.
  - **Request Body**:
    ```json
    {
      "user_id": "[사용자 ID]",
      "title": "[공고명]",
      "keyword": "[키워드]",
      "site_name": "[사이트 이름]",
      "category": "[카테고리]",
      "task": "[업무]",
      "announcement_date": "[공고일]",
      "deadline": "[마감일]",
      "budget": "[예산]",
      "contract_method": "[계약 방법]",
      "url": "[공고문 URL]"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "즐겨찾기에 성공적으로 추가되었습니다."
    }
    ```

- **즐겨찾기 삭제**
  - **Endpoint**: `DELETE /favorites/delete/`
  - **설명**: 특정 즐겨찾기 항목을 삭제합니다.
  - **Request Parameters**:
    - `user_id` (string): 사용자 ID
    - `title` (string): 공고 제목
  - **Response**:
    ```json
    {
      "message": "즐겨찾기에서 성공적으로 삭제되었습니다."
    }
    ```

- **즐겨찾기 조회**
  - **Endpoint**: `GET /favorites/`
  - **설명**: 특정 User ID의 즐겨찾기 목록을 조회합니다.
  - **Request Parameters**:
    - `user_id` (string): 사용자 ID
  - **Response**:
    ```json
    [
      {
        "site_name": "[사이트 이름]",
        "title": "[공고명]",
        "deadline": "[마감일]",
        "url": "[공고문 URL]"
      }
    ]
    ```

---

### 📂 DB 관리 API
- **데이터베이스 초기화**
  - **Endpoint**: `POST /admin/reset-database`
  - **설명**: 현재 시간보다 이전 마감일의 데이터를 삭제합니다.
  - **Response**:
    ```json
    {
      "message": "데이터베이스가 초기화되었습니다.",
      "deleted_count": 123
    }
    ```

---

### 📂 크롤링 API
- **직접 실행 크롤링**
  - **Endpoint**: `POST /crawling_now`
  - **설명**: 직접 사이트와 키워드를 입력하여 크롤링을 실행합니다.
  - **Request Body**:
    ```json
    {
      "dep_name": "[부서 ID]",
      "site_name": "[사이트 이름]",
      "keywords": "[키워드]",
      "start_date": "[시작날짜]",
    }
    ```
  - **Response**:
    ```json
    {
      "message": "결과가 {size}개 추가되었습니다."
    }
    ```

- **예약 실행 크롤링**
  - **Endpoint**: `DELETE `POST /crawling_later`
  - **설명**: 부서별 저장된 데이터베이스를 바탕으로 지정된 시간에 자동으로 크롤링 됩니다.
  - **Request Parameters**:
    - `dep_name` (string): 부서ID
  - **Response**:
    ```json
    {
      "message": "{dep_name}의 크롤링이 성공적으로 진행되엇습니다."
    }
    ```

