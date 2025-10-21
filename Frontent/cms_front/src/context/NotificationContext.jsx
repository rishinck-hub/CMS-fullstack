import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [message, setMessage] = useState(null);         // { text, type }
  const showNotification = (text, type = "info") => setMessage({ text, type });
  const hideNotification = () => setMessage(null);

  return (
    <NotificationContext.Provider value={{ message, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
