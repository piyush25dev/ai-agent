"use client";

import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";

export default function ThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();

  // mode is undefined until the client has read the saved preference.
  if (!mode) {
    return (
      <IconButton disabled aria-hidden>
        <LightModeOutlined sx={{ opacity: 0 }} />
      </IconButton>
    );
  }

  const current = mode === "system" ? systemMode : mode;
  const next = current === "dark" ? "light" : "dark";

  return (
      <IconButton onClick={() => setMode(next)} aria-label={`Switch to ${next} mode`}>
        {current === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
      </IconButton>
  );
}