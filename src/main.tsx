import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </UserProvider>
);
