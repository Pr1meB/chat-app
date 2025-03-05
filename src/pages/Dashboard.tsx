import { useEffect, useState } from "react";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import {
  GET_ALL_USERS,
  GET_ONLINE_USERS,
  GET_ALL_CHATS,
  GET_LATEST_MESSAGE,
} from "../graphql/queries";
import { START_CHAT } from "../graphql/mutations";
import websocket from "../websocket";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const { data: allUsersData, refetch: refetchUsers } = useQuery(GET_ALL_USERS, { fetchPolicy: "network-only" });
  const { data: onlineUsersData, refetch: refetchOnlineUsers } = useQuery(GET_ONLINE_USERS, { fetchPolicy: "network-only" });
  const { data: allChatsData, refetch: refetchChats } = useQuery(GET_ALL_CHATS, { variables: { userId: user?.id }, fetchPolicy: "network-only" });

  const [getLatestMessage] = useLazyQuery(GET_LATEST_MESSAGE);
  const [latestMessages, setLatestMessages] = useState<{ [chatId: number]: string }>({});
  const [unreadChats, setUnreadChats] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (allChatsData?.allChats) {
      allChatsData.allChats.forEach((chat: any) => {
        getLatestMessage({ variables: { chatId: chat.id } })
          .then(({ data }) => {
            if (data?.latestMessage) {
              setLatestMessages((prev) => ({
                ...prev,
                [chat.id]: data.latestMessage.content,
              }));
            }
          })
          .catch((error) => console.error("Error fetching latest message:", error));
      });
    }
  }, [allChatsData]);

  const [startChat] = useMutation(START_CHAT);

//   useEffect(() => {
//     websocket.connect("online_users");

//     const handleWebSocketEvent = (data: any) => {
//       if (data.event === "user_online" || data.event === "user_offline") {
//         refetchOnlineUsers();
//       }
//       if (data.event === "new_message") {
//         const { chat_id, message } = data.payload;
//         setLatestMessages((prev) => ({
//           ...prev,
//           [chat_id]: message.content,
//         }));
//         setUnreadChats((prev) => new Set(prev).add(chat_id));
//         refetchChats();
//       }
//     };

//     websocket.addMessageHandler(handleWebSocketEvent);
//     return () => {
//       websocket.removeMessageHandler(handleWebSocketEvent);
//     };
//   }, [refetchChats, refetchOnlineUsers]);

  if (!user) return navigate("/login");

  const allUsers = allUsersData?.allUsers || [];
  const onlineUsers = onlineUsersData?.onlineUsers || [];
  const chats = allChatsData?.allChats || [];

  const chatUserIds = new Set(chats.flatMap((chat: any) => chat.participants.map((p: any) => p.id)));
  const filteredUsers = allUsers.filter((u: any) => !chatUserIds.has(u.id));
  const filteredOnlineUsers = onlineUsers.filter((u: any) => !chatUserIds.has(u.id));

  const handleStartChat = async (userId: number) => {
    try {
      const { data } = await startChat({ variables: { user1Id: user.id, user2Id: userId } });
      navigate(`/chat/${data.startChat.id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const handleOpenChat = (chatId: number) => {
    setUnreadChats((prev) => {
      const newSet = new Set(prev);
      newSet.delete(chatId);
      return newSet;
    });
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h2>
      <p className="text-gray-600 mb-6">Email: {user.email}</p>

      {/* All Chats Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Your Chats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {chats.map((chat: any) => {
            const otherUser = chat.participants.find((p: any) => p.id !== user.id);
            const isUnread = unreadChats.has(chat.id);

            return (
              <div
                key={chat.id}
                className={`p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition ${
                  isUnread ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handleOpenChat(chat.id)}
              >
                <div className="flex items-center space-x-3">
                  <img src={otherUser?.avatar || "https://avatar.iran.liara.run/public"} alt="avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <strong>{otherUser?.username}</strong>
                    <p className={`text-gray-500 ${isUnread ? "font-bold" : ""}`}>
                      {latestMessages[chat.id] || "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Online Users Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Online Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredOnlineUsers.map((u: any) => (
            <div
              key={u.id}
              className="p-4 bg-green-100 rounded-lg shadow-md cursor-pointer hover:bg-green-200 transition"
              onClick={() => handleStartChat(u.id)}
            >
              <div className="flex items-center space-x-3">
                <img src={u.avatar || "https://avatar.iran.liara.run/public"} alt="avatar" className="w-10 h-10 rounded-full" />
                <div>
                  <strong>{u.username}</strong>
                  <p className="text-sm text-green-600">(Online)</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Users Section */}
      <div>
        <h3 className="text-xl font-semibold mb-3">All Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredUsers.map((u: any) => (
            <div
              key={u.id}
              className="p-4 bg-blue-100 rounded-lg shadow-md cursor-pointer hover:bg-blue-200 transition"
              onClick={() => handleStartChat(u.id)}
            >
              <div className="flex items-center space-x-3">
                <img src={u.avatar || "https://avatar.iran.liara.run/public"} alt="avatar" className="w-10 h-10 rounded-full" />
                <strong>{u.username}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
