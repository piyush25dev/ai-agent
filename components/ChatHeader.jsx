"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";

import ThemeToggle from "./ThemeToggle";

export default function ChatHeader({ onMenuClick }) {
  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar sx={{ gap: 1, minHeight: { xs: 64, sm: 72 } }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="h1" variant="h1" noWrap sx={{ fontSize: { xs: "1.15rem", sm: "1.5rem" } }}>
            Build. Plan. Act.
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Give the agent a task and it decides when to use tools.
          </Typography>
        </Box>

        <ThemeToggle />
      </Toolbar>
    </AppBar>
  );
}