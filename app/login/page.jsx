"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

import { auth } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle";
import Container from "@mui/material/Container";

// three.js is only needed here, so keep it out of the main bundle
const LoginScene = dynamic(() => import("../../components/LoginScene"), {
  ssr: false,
});

/* Official multi-colour Google "G" */
function GoogleIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </SvgIcon>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  async function handleGoogleLogin() {
    setError("");
    setSubmitting(true);

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("Google login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to login with Google."
      );

      setSubmitting(false);
    }
  }

  if (loading || user) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "background.default" }}>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <CircularProgress size={32} />
          <Typography variant="body2" color="text.secondary">
            Loading...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box>
      <Container maxWidth="xl">
        <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden", bgcolor: "background.default" }}>
          <LoginScene />

          <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
            <ThemeToggle />
          </Box>

          <Box
            component="main"
            sx={{
              position: "relative",
              zIndex: 1,
              minHeight: "100vh",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            }}
          >
            {/* Brand panel: the 3D scene fills the middle, copy sits underneath */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                p: { md: 6, lg: 8 },
              }}
            >
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                <Avatar variant="rounded" sx={{ width: 36, height: 36, bgcolor: "primary.main", color: "primary.contrastText" }}>
                  <AutoAwesomeRoundedIcon fontSize="small" />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  AI Agent
                </Typography>
              </Stack>

              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: { md: "2.25rem", lg: "2.75rem" },
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    maxWidth: 480,
                  }}
                >
                  Hand off the busywork. Keep the decisions.
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 440, lineHeight: 1.7 }}>
                  Your agent reads, plans and drafts alongside you, so you can
                  spend your time on the parts that need you.
                </Typography>
              </Box>
            </Box>

            {/* Sign-in panel */}
            <Box sx={{ display: "grid", placeItems: "center", p: { xs: 2.5, sm: 4 } }}>
              <Paper
                variant="outlined"
                sx={{
                  width: "100%",
                  maxWidth: 420,
                  p: { xs: 3, sm: 5 },
                  borderRadius: 3,
                  bgcolor: "rgba(var(--mui-palette-background-paperChannel) / 0.78)",
                  backdropFilter: "blur(14px)",
                  boxShadow: "0 24px 60px -24px rgba(var(--mui-palette-primary-mainChannel) / 0.35)",
                }}
              >
                <Stack spacing={3.5}>
                  <Stack spacing={1.5}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.14)",
                        color: "primary.main",
                        display: { md: "none" },
                      }}
                    >
                      <AutoAwesomeRoundedIcon />
                    </Avatar>

                    <Typography variant="h1" component="h1">
                      Welcome back
                    </Typography>
                    <Typography color="text.secondary">
                      Sign in to continue to your AI Agent.
                    </Typography>
                  </Stack>

                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    color="inherit"
                    onClick={handleGoogleLogin}
                    disabled={submitting}
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
                    sx={{
                      py: 1.5,
                      borderColor: "divider",
                      bgcolor: "background.paper",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.06)",
                      },
                    }}
                  >
                    {submitting ? "Signing in..." : "Continue with Google"}
                  </Button>

                  {error && (
                    <Alert severity="error" variant="outlined" onClose={() => setError("")}>
                      {error}
                    </Alert>
                  )}

                  <Divider />

                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={1.25}>
                      <LockRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        We only use your Google account to verify who you are.
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.25}>
                      <BoltRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        One click, no password to remember.
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                    By continuing you agree to the{" "}
                    <Link href="/terms" underline="hover" color="primary">Terms</Link>{" "}
                    and{" "}
                    <Link href="/privacy" underline="hover" color="primary">Privacy Policy</Link>.
                  </Typography>
                </Stack>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}