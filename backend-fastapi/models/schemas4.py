from pydantic import BaseModel

class UserResult(BaseModel):  # 이름을 UserResult로 수정
    name: str
    password: str
