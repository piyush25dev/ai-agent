import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  writeBatch,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function createChat(userId, title) {
  const chatsRef = collection(
    db,
    "users",
    userId,
    "chats"
  );

  const chatRef = await addDoc(chatsRef, {
    title: title || "New Chat",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return chatRef.id;
}

export async function saveMessage(
  userId,
  chatId,
  message
) {
  if (!userId) {
    throw new Error("User ID is missing.");
  }

  if (!chatId) {
    throw new Error("Chat ID is missing.");
  }

  if (!message?.role) {
    throw new Error("Message role is missing.");
  }

  if (typeof message.content !== "string") {
    throw new Error("Message content must be a string.");
  }

  console.log("Saving message:", {
    userId,
    chatId,
    role: message.role,
    content: message.content,
  });

  const messagesRef = collection(
    db,
    "users",
    userId,
    "chats",
    chatId,
    "messages"
  );

  const messageRef = await addDoc(messagesRef, {
    role: message.role,
    content: message.content,
    createdAt: serverTimestamp(),
  });

  console.log(
    "Message saved successfully:",
    messageRef.id
  );

  await setDoc(
    doc(
      db,
      "users",
      userId,
      "chats",
      chatId
    ),
    {
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  return messageRef.id;
}

export async function getUserChats(userId) {
  const chatsRef = collection(
    db,
    "users",
    userId,
    "chats"
  );

  const q = query(
    chatsRef,
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function getChatMessages(
  userId,
  chatId
) {
  const messagesRef = collection(
    db,
    "users",
    userId,
    "chats",
    chatId,
    "messages"
  );

  const q = query(
    messagesRef,
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}

export async function deleteChat(userId, chatId) {
  if (!userId) {
    throw new Error("User ID is missing.");
  }

  if (!chatId) {
    throw new Error("Chat ID is missing.");
  }

  const messagesRef = collection(
    db,
    "users",
    userId,
    "chats",
    chatId,
    "messages"
  );

  const snapshot = await getDocs(messagesRef);

  const batch = writeBatch(db);

  snapshot.docs.forEach((messageDoc) => {
    batch.delete(messageDoc.ref);
  });

  const chatRef = doc(
    db,
    "users",
    userId,
    "chats",
    chatId
  );

  batch.delete(chatRef);

  await batch.commit();
}

export async function updateChatTitle(
  userId,
  chatId,
  title
) {
  if (!userId) {
    throw new Error("User ID is missing.");
  }

  if (!chatId) {
    throw new Error("Chat ID is missing.");
  }

  const cleanedTitle = title
    .trim()
    .replace(/\s+/g, " ");

  if (!cleanedTitle) {
    throw new Error("Chat title cannot be empty.");
  }

  if (cleanedTitle.length > 60) {
    throw new Error(
      "Chat title cannot exceed 60 characters."
    );
  }

  const chatRef = doc(
    db,
    "users",
    userId,
    "chats",
    chatId
  );

  await updateDoc(chatRef, {
    title: cleanedTitle,
    updatedAt: serverTimestamp(),
  });
}