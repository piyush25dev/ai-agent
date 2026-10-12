"use client";

import { useEffect, useRef } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useChat } from "../context/ChatContext";
import MarkdownMessage from "./MarkdownMessage";

function MessageRow({ message, events }) {
  const isUser = message.role === "user";

  return (
    <Stack
      direction={isUser ? "row-reverse" : "row"}
      spacing={1.5}
      sx={{
        alignSelf: isUser ? "flex-end" : "stretch",
        maxWidth: isUser ? { xs: "92%", sm: "80%", md: "100%" } : "100%",
      }}
    >
      {/* <Avatar
        sx={{
          width: 32,
          height: 32,
          fontSize: 12,
          fontWeight: 600,
          bgcolor: isUser ? "primary.main" : "secondary.main",
          color: isUser ? "primary.contrastText" : "#fff",
        }}
      >
        {isUser ? "You" : "AI"}
      </Avatar> */}

      <Box sx={{ minWidth: 0, flex: isUser ? "0 1 auto" : 1, width: "100%" }}>
        <Paper
          variant="outlined"
          sx={{
            px: 2,
            py: 1.25,
            overflowWrap: "anywhere",
            bgcolor: isUser ? "primary.main" : "background.paper",
            color: isUser ? "primary.contrastText" : "text.primary",
            borderColor: isUser ? "primary.main" : "divider",
            
          }}
        >
          {isUser ? (
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", maxHeight: "400px",
            overflowY: "auto", }}>
              {message.content}
            </Typography>
          ) : (
            <MarkdownMessage content={message.content} />
          )}
        </Paper>

        {events.length > 0 && (
          <Accordion
            disableGutters
            variant="outlined"
            sx={{ mt: 1, "&::before": { display: "none" }, bgcolor: "transparent" }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="caption" color="text.secondary">
                Agent activity ({events.length} {events.length === 1 ? "step" : "steps"})
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Stack spacing={0.5}>
                {events.map((event, i) => (
                  <Typography key={i} variant="caption" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                    {event.message}
                  </Typography>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </Stack>
  );
}

export default function MessagesArea() {
  const { messages, events, loading, loadingMessages } = useChat();
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const isEmpty = messages.length === 0 && !loading && !loadingMessages;

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      <Stack
        spacing={2}
        sx={{ maxWidth: 900, mx: "auto", px: { xs: 2, sm: 3 }, py: 3, minHeight: "100%" }}
      >
        {loadingMessages && (
          <Box sx={{ m: "auto" }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {isEmpty && (
          <Box sx={{ m: "auto !important", textAlign: "center", color: "text.secondary" }}>
            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 44, mb: 1, color: "primary.main" }} />
            <Typography variant="h6" color="text.primary">
              Start a conversation
            </Typography>
            <Typography variant="body2">
              Describe a task and the agent will pick the right tools.
            </Typography>
          </Box>
        )}

        {messages.map((message, index) => (
          <MessageRow
            key={index}
            message={message}
            events={
              message.role === "assistant" && index === messages.length - 1
                ? events
                : []
            }
          />
        ))}

        {loading && (
          <Stack direction="row" spacing={1.5}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: "secondary.main", color: "#fff" }}>
              AI
            </Avatar>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Working on it…
            </Typography>
          </Stack>
        )}

        <div ref={endRef} />
      </Stack>
    </Box>
  );
}