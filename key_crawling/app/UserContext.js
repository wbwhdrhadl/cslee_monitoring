import React, { createContext, useContext, useState } from 'react';

// UserContext 생성
const UserContext = createContext(null);

// UserProvider 컴포넌트
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // user_id 상태 관리

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

// useUser 훅
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
