"use client";

import { useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";

import { useChat } from "../context/ChatContext";

export default function ChatInput() {
  const { chatId, sending, error, clearError, sendMessage } = useChat();
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  // Refocus after a reply or when switching chats, on desktop only
  // (on phones this would pop the keyboard open unprompted).
  useEffect(() => {
    if (!sending && window.matchMedia("(min-width: 900px)").matches) {
      inputRef.current?.focus();
    }
  }, [sending, chatId]);

  function submit() {
    if (!text.trim() || sending) return;
    sendMessage(text);
    setText("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <Box sx={{ borderTop: 1, borderColor: "divider", bgcolor: "background.paper", p: { xs: 1.5, sm: 2 } }}>
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {error && (
          <Alert severity="error" onClose={clearError} sx={{ mb: 1.5 }}>
            {error}
          </Alert>
        )}

        <Stack
          component="form"
          direction="row"
          spacing={1.5}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <TextField
            inputRef={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything. Shift+Enter adds a new line."
            disabled={sending}
            multiline
            maxRows={5}
            fullWidth
            size="small"
          />
          <IconButton
            type="submit"
            aria-label="Send message"
            disabled={sending || !text.trim()}
            sx={{
              width: 44,
              height: 44,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
              "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
            }}
          >
            {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon fontSize="small" />}
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}