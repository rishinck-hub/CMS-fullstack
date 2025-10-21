import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import AppRoutes from "./routes"; // Your route definitions
import Toast from "./ui/Toast";
import useNotification from "./hooks/useNotification";

function AppContent() {
  const { message, hideNotification } = useNotification() || {};
  return (
    <>
      <AppRoutes />
      <Toast
        show={!!message}
        message={message?.text}
        type={message?.type}
        onClose={hideNotification}
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </ThemeProvider>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;
