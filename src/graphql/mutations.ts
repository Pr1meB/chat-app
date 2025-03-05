import { gql } from "@apollo/client";

// Update user profile
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($userId: Int!, $bio: String!) {
    updateProfile(userId: $userId, bio: $bio) {
      bio
      online
    }
  }
`;

// Start a chat
export const START_CHAT = gql`
  mutation StartChat($user1Id: Int!, $user2Id: Int!) {
    startChat(input: { user1Id: $user1Id, user2Id: $user2Id }) {
      id
      startedAt
      participants {
        id
        username
      }
    }
  }
`;

// Send a message
export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: Int!, $senderId: Int!, $content: String!, $mediaType: String) {
    sendMessage(input: { chatId: $chatId, senderId: $senderId, content: $content, mediaType: $mediaType }) {
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

// Mark messages as read
export const MARK_MESSAGES_READ = gql`
  mutation MarkMessagesRead($chatId: Int!, $userId: Int!) {
    markMessagesRead(chatId: $chatId, userId: $userId)
  }
`;

// Delete a chat
export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: Int!) {
    deleteChat(chatId: $chatId)
  }
`;

// Delete a message
export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($messageId: Int!) {
    deleteMessage(messageId: $messageId)
  }
`;

// Logout (set user offline)
export const LOGOUT = gql`
  mutation Logout($userId: Int!) {
    logout(userId: $userId)
  }
`;
