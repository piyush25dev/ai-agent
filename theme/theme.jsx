import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    dark: {
      palette: {
        primary: { main: "#06b6d4", contrastText: "#0f172a" },
        secondary: { main: "#8b5cf6" },
        background: { default: "#0b1220", paper: "#111a2e" },
        text: { primary: "#e2e8f0", secondary: "#94a3b8" },
        divider: "rgba(148, 163, 184, 0.16)",
      },
    },
    light: {
      palette: {
        primary: { main: "#0d1616", contrastText: "#ffffff" },
        secondary: { main: "#7c3aed" },
        background: { default: "#f1f5f9", paper: "#ffffff" },
        text: { primary: "#0f172a", secondary: "#475569" },
        divider: "rgba(15, 23, 42, 0.12)",
      },
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: "1.5rem", fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiListItemButton: {
      styleOverrides: { root: { borderRadius: 8, marginBottom: 2 } },
    },
  },
});

export default theme;