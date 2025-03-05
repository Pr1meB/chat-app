import { gql } from "@apollo/client";

// Get all users
export const GET_ALL_USERS = gql`
  query {
    allUsers {
      id
      username
      email
    }
  }
`;

// Get a single user by ID
export const GET_USER = gql`
  query GetUser($userId: Int!) {
    getUser(userId: $userId) {
      id
      username
      email
    }
  }
`;

// Get all online users
export const GET_ONLINE_USERS = gql`
  query {
    onlineUsers {
      id
      username
      email
    }
  }
`;

// Get user profile by ID
export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: Int!) {
    profile(userId: $userId) {
      bio
      online
    }
  }
`;

// Get all chats for a user
export const GET_ALL_CHATS = gql`
  query GetAllChats($userId: Int!) {
    allChats(userId: $userId) {
      id
      startedAt
      participants {
        id
        username
      }
    }
  }
`;

// Get a specific chat by ID
export const GET_CHAT = gql`
  query GetChat($chatId: Int!) {
    getChat(chatId: $chatId) {
      id
      startedAt
      participants {
        id
        username
      }
    }
  }
`;

// Get all messages in a chat
export const GET_ALL_MESSAGES = gql`
  query GetAllMessages($chatId: Int!) {
    allMessages(chatId: $chatId) {
      id
      sender {
        id
        username
      }
      mediaType
      timestamp
      content
    }
  }
`;

// Get all messages sent by a user
export const GET_USER_MESSAGES = gql`
  query GetUserMessages($userId: Int!) {
    userMessages(userId: $userId) {
      id
      sender {
        id
        username
      }
      mediaType
      timestamp
      content
    }
  }
`;

// Get the latest message in a chat
export const GET_LATEST_MESSAGE = gql`
  query GetLatestMessage($chatId: Int!) {
    latestMessage(chatId: $chatId) {
      id
      sender {
        id
        username
      }
      mediaType
      timestamp
      content
    }
  }
`;
