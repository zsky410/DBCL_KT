import React, { createContext, useContext, useState } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

interface NotificationContextValue {
  notify: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Notification[]>([]);

  const notify = (type: NotificationType, message: string) => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((n) => n.id !== id));
    }, 2500);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex justify-center px-4">
        <div className="flex max-w-md flex-col gap-2">
          {items.map((n) => (
            <div
              key={n.id}
              className={`pointer-events-auto rounded-2xl px-4 py-3 text-sm shadow-lg border animate-[slideDown_0.3s_ease-out] ${
                n.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : n.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}
            >
              {n.message}
            </div>
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return ctx;
};

