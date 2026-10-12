"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";

export const DRAWER_WIDTH = 280;
export const DRAWER_WIDTH_COLLAPSED = 72;

export default function AppShell({ children }) {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  async function handleLogout() {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (authLoading) {
    return (
      <Box sx={{ height: "100dvh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  const drawerWidth = sidebarCollapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const sidebar = (
    <Sidebar
      user={user}
      onLogout={handleLogout}
      onNavigate={() => setMobileOpen(false)}
      collapsed={sidebarCollapsed}
      onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
    />
  );

  return (
    <Box sx={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
      {/* Mobile: slides in on demand */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, maxWidth: "85vw" },
        }}
      >
        {sidebar}
      </Drawer>

      {/* Desktop: always visible */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { 
            width: drawerWidth, 
            boxSizing: "border-box",
            transition: "width 0.2s ease-in-out",
          },
        }}
      >
        {sidebar}
      </Drawer>

      <Box
        component="main"
        sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}
      >
        <ChatHeader onMenuClick={() => setMobileOpen(true)} />
        {children}
      </Box>
    </Box>
  );
}