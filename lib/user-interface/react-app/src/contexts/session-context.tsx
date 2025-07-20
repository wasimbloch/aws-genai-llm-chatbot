import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface SessionContextType {
  sessionId: string;
  createSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Check if there's a session ID in local storage
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      createSession();
    }
  }, []);

  const createSession = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    localStorage.setItem('sessionId', newSessionId);
  };

  return (
    <SessionContext.Provider value={{ sessionId, createSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};