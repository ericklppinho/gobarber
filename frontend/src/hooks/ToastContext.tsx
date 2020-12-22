import React, { createContext, useContext } from 'react';

const ToastContext = createContext({});

export const ToastProvider: React.FC = ({ children }) => {
  return <ToastContext.Provider value={{}}>{children}</ToastContext.Provider>;
};

export function useToast(): {} {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
