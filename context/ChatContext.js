"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";

import { useAuth } from "./AuthContext";

import {
  createChat,
  saveMessage,
  getUserChats,
  getChatMessages,
  deleteChat,
  updateChatTitle,
} from "../lib/chats";

const ChatContext = createContext(null);

export function useChat() {
  const value = useContext(ChatContext);

  if (!value) {
    throw new Error(
      "useChat must be used inside <ChatProvider>"
    );
  }

  return value;
}

export function ChatProvider({ children }) {
  const router = useRouter();
  const params = useParams();

  const chatId = params?.chatId ?? null;

  const { user } = useAuth();
  const uid = user?.uid;

  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  // null = idle
  // "new" = creating a new chat
  // chatId = answering existing chat
  const [sendingKey, setSendingKey] = useState(null);

  const activeChatRef = useRef(chatId);
  const skipLoadRef = useRef(null);
  const createdIdRef = useRef(null);

  useEffect(() => {
    activeChatRef.current = chatId;
  }, [chatId]);

  /*
   * Once the route for a freshly created chat is live,
   * track the send by its actual chat ID.
   */
  useEffect(() => {
    if (
      sendingKey === "new" &&
      chatId &&
      chatId === createdIdRef.current
    ) {
      setSendingKey(chatId);
    }
  }, [sendingKey, chatId]);

  /*
   * Load sidebar chats.
   */
  useEffect(() => {
    if (!uid) return;

    let cancelled = false;

    (async () => {
      try {
        setLoadingChats(true);

        const userChats =
          await getUserChats(uid);

        if (!cancelled) {
          setChats(userChats);
        }
      } catch (err) {
        console.error(
          "Failed to load chats:",
          err
        );

        if (!cancelled) {
          setError(
            "Unable to load your chats."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingChats(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  /*
   * Load messages for the chat in the URL.
   */
  useEffect(() => {
    if (!uid) return;

    if (!chatId) {
      setMessages([]);
      setEvents([]);
      setError("");
      setLoadingMessages(false);
      return;
    }

    /*
     * The chat was just created and we already have
     * its messages in local state.
     */
    if (skipLoadRef.current === chatId) {
      skipLoadRef.current = null;
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoadingMessages(true);
        setMessages([]);
        setEvents([]);
        setError("");

        const chatMessages =
          await getChatMessages(
            uid,
            chatId
          );

        if (!cancelled) {
          setMessages(chatMessages);
        }
      } catch (err) {
        console.error(
          "Failed to load chat:",
          err
        );

        if (!cancelled) {
          setError(
            "Unable to load this chat."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingMessages(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [uid, chatId]);

  /*
   * Send a message to the AI agent.
   */
  const sendMessage = useCallback(
    async (text) => {
      const content = text.trim();

      if (
        !user ||
        !content ||
        sendingKey !== null
      ) {
        return;
      }

      let currentChatId =
        activeChatRef.current;

      const isNewChat = !currentChatId;

      const isActive = () =>
        activeChatRef.current ===
        currentChatId;

      setError("");
      setEvents([]);

      setSendingKey(
        currentChatId ?? "new"
      );

      try {
        /*
         * Show the user's message immediately.
         */
        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content,
          },
        ]);

        /*
         * Ask the AI first.
         *
         * For a new chat, the AI will generate:
         * - title
         * - answer
         *
         * For an existing chat, it only generates
         * the answer.
         */
        const response = await fetch(
          "/api/agent",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              task: content,
              isNewChat,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
            "Request failed"
          );
        }

        /*
         * Create the Firestore chat using
         * the AI-generated title.
         */
        if (!currentChatId) {
          const title =
            data.title ||
            "New Chat";

          currentChatId =
            await createChat(
              user.uid,
              title
            );

          createdIdRef.current =
            currentChatId;

          activeChatRef.current =
            currentChatId;

          skipLoadRef.current =
            currentChatId;

          router.push(
            `/chat/${currentChatId}`
          );
        }

        /*
         * Save user's message.
         */
        await saveMessage(
          user.uid,
          currentChatId,
          {
            role: "user",
            content,
          }
        );

        /*
         * AI response.
         */
        const answer =
          data.answer || "";

        if (isActive()) {
          setEvents(
            data.events || []
          );

          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: answer,
            },
          ]);
        }

        /*
         * Save AI response.
         */
        try {
          await saveMessage(
            user.uid,
            currentChatId,
            {
              role: "assistant",
              content: answer,
            }
          );
        } catch (saveError) {
          console.error(
            "Failed to save assistant response:",
            saveError
          );

          if (isActive()) {
            setError(
              "The AI response was generated, but it could not be saved to the database."
            );
          }
        }

        /*
         * Refresh sidebar so the new chat/title
         * immediately appears.
         */
        setChats(
          await getUserChats(
            user.uid
          )
        );
      } catch (err) {
        console.error(
          "Agent error:",
          err
        );

        if (isActive()) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        createdIdRef.current =
          null;

        setSendingKey(null);
      }
    },
    [user, sendingKey, router]
  );

  const removeChat = useCallback(
    async (chatIdToDelete) => {
      if (!user?.uid || !chatIdToDelete) {
        return;
      }

      try {
        setError("");

        await deleteChat(
          user.uid,
          chatIdToDelete
        );

        setChats((prev) =>
          prev.filter(
            (chat) =>
              chat.id !== chatIdToDelete
          )
        );

        // If the deleted chat is currently open,
        // return to the main chat screen.
        if (
          activeChatRef.current ===
          chatIdToDelete
        ) {
          activeChatRef.current = null;
          setMessages([]);
          setEvents([]);
          router.push("/");
        }
      } catch (err) {
        console.error(
          "Failed to delete chat:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to delete chat."
        );
      }
    },
    [user, router]
  );

  const renameChat = useCallback(
    async (chatIdToRename, newTitle) => {
      if (!user?.uid || !chatIdToRename) {
        return;
      }

      const cleanedTitle = newTitle
        .trim()
        .replace(/\s+/g, " ");

      if (!cleanedTitle) {
        throw new Error(
          "Chat title cannot be empty."
        );
      }

      await updateChatTitle(
        user.uid,
        chatIdToRename,
        cleanedTitle
      );

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatIdToRename
            ? {
              ...chat,
              title: cleanedTitle,
            }
            : chat
        )
      );
    },
    [user]
  );

  const value = {
    chatId,
    chats,
    loadingChats,
    messages,
    loadingMessages,
    events,
    error,
    clearError: () => setError(""),
    sending: sendingKey !== null,
    loading:
      sendingKey !== null &&
      sendingKey === (chatId ?? "new"),
    sendMessage,
    deleteChat: removeChat,
    renameChat,
  };

  return (
    <ChatContext.Provider
      value={value}
    >
      {children}
    </ChatContext.Provider>
  );
}