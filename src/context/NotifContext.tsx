'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type NotifType = 'success' | 'error' | 'info';

interface Notif {
  id: number;
  message: string;
  type: NotifType;
}

interface NotifContextProps {
  notifs: Notif[];
  notify: (message: string, type?: NotifType) => void;
  removeNotif: (id: number) => void;
}

export const NotifContext = createContext<NotifContextProps | undefined>(undefined);

export const NotifProvider = ({ children }: { children: ReactNode }) => {
  const [notifs, setNotifs] = useState<Notif[]>([]);

  const notify = useCallback((message: string, type: NotifType = 'info') => {
    const id = Date.now();
    setNotifs((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifs((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotif = useCallback((id: number) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotifContext.Provider value={{ notifs, notify, removeNotif }}>
      {children}
      {/* Toast Render */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white fade-in min-w-[250px] flex justify-between items-center ${
              n.type === 'success' ? 'bg-[#2D6A4F]' : n.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}
          >
            <span>{n.message}</span>
            <button onClick={() => removeNotif(n.id)} className="ml-4 text-white hover:text-gray-200">
              ✖
            </button>
          </div>
        ))}
      </div>
    </NotifContext.Provider>
  );
};

export const useNotif = () => {
  const context = useContext(NotifContext);
  if (!context) throw new Error('useNotif must be used within NotifProvider');
  return context;
};
