import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import AppThemeProvider from "../components/AppThemeProvider";

export const metadata = {
  title: "AI Agent",
  description: "A tool-using AI agent",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" defaultMode="dark" />
        <AppThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}