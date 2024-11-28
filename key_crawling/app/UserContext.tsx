import React, { createContext, useContext, useState } from 'react';

// UserContext 타입 설정
type UserContextType = {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
} | null;

// UserContext 생성
const UserContext = createContext<UserContextType>(null);

// Provider 컴포넌트
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// 기본 내보내기 추가
export default UserContext;
