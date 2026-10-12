import { ChatProvider } from "../../context/ChatContext";
import AppShell from "../../components/AppShell";

// Shared by "/" and "/chat/[chatId]": the sidebar and chat state stay mounted
// while the route changes underneath.
export default function AppLayout({ children }) {
  return (
    <ChatProvider>
      <AppShell>{children}</AppShell>
    </ChatProvider>
  );
}