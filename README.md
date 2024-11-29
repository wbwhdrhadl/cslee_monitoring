## 파일 경로 정리
- 📁 `backend-fastapi` : [BACK-END] 해당 경로에서 'uvicorn app:app --host 0.0.0.0 --port [포드번호]' 다음 명령어로 실행합니다.
   - 📁 `__pycache__`
   - 📁 models : 모델 정의, 데이터 연결 폴더 모음
   - 📄 `__init__.py`
   - 📄 `app.py` : API 연결 파일

     
- 📁 `key_crawling` : [FRONT-END] 해당 경로에서 'npx expo start' 다음 명령어로 실행합니다.
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

