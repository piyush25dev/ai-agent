"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add as AddIcon,
  Chat as ChatIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  DeleteOutlined as DeleteOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { useChat } from "../context/ChatContext";

const actionsSx = { px: 3, pb: 2 };

export default function Sidebar({
  user,
  onLogout,
  onNavigate,
  collapsed: c,
  onToggleCollapse,
}) {
  const { chats, loadingChats, chatId, deleteChat, renameChat } = useChat();

  // Delete dialog: open while deleteTarget is set
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit dialog: open while editTarget is set
  const [editTarget, setEditTarget] = useState(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const deletingId = deleting ? deleteTarget?.id : null;

  // Open a dialog from a button inside the chat link without navigating
  const openDialog = (event, open) => {
    event.preventDefault();
    event.stopPropagation();
    open();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteChat(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setDeleting(false);
    }
  };

  const saveTitle = async () => {
    const next = title.trim().replace(/\s+/g, " ");
    if (!next || saving) return;
    if (next === editTarget.title) return setEditTarget(null);

    setSaving(true);
    try {
      await renameChat(editTarget.id, next);
      setEditTarget(null);
    } catch (error) {
      console.error("Failed to rename chat:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box sx={{ p: c ? 1 : 2 }}>
          {!c && (
            <Typography
              variant="h6"
              color="primary"
              noWrap
              sx={{ fontWeight: 700, mb: 1.5 }}
            >
              AI Agent
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href="/"
            onClick={onNavigate}
            aria-label="New chat"
            sx={{
              justifyContent: c ? "center" : "flex-start",
              minWidth: c ? 40 : undefined,
              px: c ? 1 : undefined,
            }}
          >
            {!c && "New chat"}
          </Button>
        </Box>

        <Divider />

        {/* Chats */}
        <List
          dense
          sx={{ flex: 1, overflowY: "auto", px: 1, minHeight: 0 }}
          subheader={
            !c && (
              <ListSubheader
                disableSticky
                sx={{ bgcolor: "transparent", pb: 1 }}
              >
                Your chats
              </ListSubheader>
            )
          }
        >
          {loadingChats && (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <CircularProgress size={20} />
            </Box>
          )}

          {!loadingChats && chats.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              {c ? "No chats" : "No chats yet. Send a message to start one."}
            </Typography>
          )}

          {chats.map((chat) => {
            const name = chat.title || "Untitled chat";
            const isActive = chat.id === chatId;
            const busy = chat.id === deletingId;

            return (
              <Tooltip
                key={chat.id}
                title={c ? name : ""}
                placement="right"
                enterDelay={200}
                disableHoverListener={!c || busy || Boolean(editTarget)}
              >
                <ListItemButton
                  component={Link}
                  href={`/chat/${chat.id}`}
                  selected={isActive}
                  onClick={onNavigate}
                  disabled={busy}
                  sx={{
                    px: c ? 1 : 1.5,
                    justifyContent: c ? "center" : "flex-start",
                    borderRadius: 1,
                    minHeight: 40,
                    "&:hover .actions": { display: "flex" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: c ? 0 : 40,
                      justifyContent: c ? "center" : "initial",
                      color: isActive ? "primary.main" : "inherit",
                    }}
                  >
                    <ChatIcon fontSize="small" />
                  </ListItemIcon>

                  {!c && (
                    <>
                      <ListItemText
                        primary={name}
                        slotProps={{ primary: { variant: "body2", noWrap: true } }}
                        sx={{ minWidth: 0, mr: 0.5 }}
                      />

                      {/* Shown on row hover (CSS), or while deleting */}
                      <Stack
                        className="actions"
                        direction="row"
                        spacing={0.25}
                        sx={{
                          display: busy ? "flex" : "none",
                          flexShrink: 0,
                          ml: "auto",
                        }}
                      >
                          <IconButton
                            size="small"
                            aria-label={`Edit ${name} title`}
                            onClick={(e) =>
                              openDialog(e, () => {
                                setEditTarget(chat);
                                setTitle(chat.title || "");
                              })
                            }
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            disabled={busy}
                            aria-label={`Delete ${name}`}
                            onClick={(e) =>
                              openDialog(e, () => setDeleteTarget(chat))
                            }
                          >
                            {busy ? (
                              <CircularProgress size={16} />
                            ) : (
                              <DeleteOutlinedIcon fontSize="small" />
                            )}
                          </IconButton>
                      </Stack>
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>

        <Divider />

        {/* User section */}
        <Stack
          direction="row"
          sx={{
            p: 1.5,
            alignItems: "center",
            justifyContent: c ? "center" : "flex-start",
            gap: c ? 0 : 1.5,
          }}
        >
          {!c && (
            <>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                {(user?.email?.[0] || "U").toUpperCase()}
              </Avatar>

              <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
                {user?.email}
              </Typography>
            </>
          )}

          <Tooltip title={c ? "Log out" : ""} placement="left">
            <IconButton
              size="small"
              onClick={onLogout}
              aria-label="Log out"
              sx={{ flexShrink: 0 }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip
            title={c ? "Expand sidebar" : "Collapse sidebar"}
            placement={c ? "right" : "left"}
          >
            <IconButton
              size="small"
              onClick={onToggleCollapse}
              aria-label={c ? "Expand sidebar" : "Collapse sidebar"}
              sx={{ flexShrink: 0, ml: c ? 0 : "auto" }}
            >
              {c ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Edit title dialog (Escape/backdrop close handled by Dialog) */}
      <Dialog
        open={Boolean(editTarget)}
        onClose={() => !saving && setEditTarget(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit chat title</DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Change the title of this conversation.
          </DialogContentText>

          <TextField
            autoFocus
            fullWidth
            label="Chat title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                saveTitle();
              }
            }}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            helperText={`${title.length}/60`}
            disabled={saving}
          />
        </DialogContent>

        <DialogActions sx={actionsSx}>
          <Button onClick={() => setEditTarget(null)} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={saveTitle}
            disabled={saving || !title.trim()}
            startIcon={saving ? <CircularProgress size={16} /> : null}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete chat?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.title || "this chat"}</strong>? This will
            permanently delete the chat and all of its messages.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={actionsSx}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={deleting}
            startIcon={
              deleting ? <CircularProgress size={16} /> : <DeleteOutlinedIcon />
            }
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}