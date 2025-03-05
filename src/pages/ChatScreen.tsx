import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { GET_CHAT, GET_ALL_MESSAGES } from "../graphql/queries";
import { SEND_MESSAGE } from "../graphql/mutations";
import websocket from "../websocket";
import { MoreVertical, ArrowLeft } from "lucide-react";
import LogoutButton from "../components/LogoutButton";
import bgImage from "../assets/images/bg.jpg";

const ChatScreen = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: chatData } = useQuery(GET_CHAT, { variables: { chatId: Number(chatId) } });
  const { data: messagesData } = useQuery(GET_ALL_MESSAGES, { variables: { chatId: Number(chatId) } });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const [messages, setMessages] = useState<any[]>(messagesData?.allMessages || []);
  const [messageInput, setMessageInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [_, forceUpdate] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;
    websocket.connect(chatId);

    const handleMessage = (data: any) => {
      if (data.event === "new_message") {
        const newMessage = data.payload.message;
        if (!newMessage.content) {
          console.warn("Received empty message!", newMessage);
          return;
        }
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        forceUpdate((prev) => prev + 1);
      }
    };

    websocket.addMessageHandler(handleMessage);
    return () => {
      websocket.removeMessageHandler(handleMessage);
    };
  }, [chatId]);

  useEffect(() => {
    if (messagesData?.allMessages) {
      setMessages((prevMessages) => {
        const newMessages = messagesData.allMessages.filter(
          (msg: any) => !prevMessages.some((m) => m.id === msg.id)
        );
        return [...prevMessages, ...newMessages];
      });
    }
  }, [messagesData]);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chat = chatData?.getChat;
  const otherUser = chat?.participants.find((p: any) => p.id !== user.id);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    try {
      const { data } = await sendMessage({
        variables: {
          chatId: Number(chatId),
          senderId: user.id,
          content: messageInput,
        },
      });
      const newMessage = data?.sendMessage;
      if (newMessage) {
        websocket.send({ event: "new_message", payload: { chat_id: chatId, message: newMessage } });
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        forceUpdate((prev) => prev + 1);
      }
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div
      className="h-screen w-full flex flex-col relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <div className="p-4 flex items-center bg-white shadow-md justify-between relative">
        <button onClick={() => navigate("/dashboard")} className="flex items-center text-gray-800">
          <ArrowLeft size={24} className="mr-2" />
        </button>

        <div className="flex items-center">
          <img src="https://avatar.iran.liara.run/public" alt="avatar" className="w-10 h-10 rounded-full mr-3" />
          <h2 className="text-xl font-bold">{otherUser?.username}</h2>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="relative">
          <MoreVertical size={24} className="text-gray-800" />
        </button>

        {menuOpen && (
          <div className="absolute top-14 right-4 bg-white shadow-md rounded-lg w-48 py-2 z-50">
            {user ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                  Dashboard
                </Link>
                <div className="flex items-center px-4 py-2">
                  <img
                    src="https://avatar.iran.liara.run/public"
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{user.username}</span>
                </div>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100">
                  Sign Up
                </Link>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg: any) => {
          const isMyMessage = msg.sender.id === user.id;
          return (
            <div key={msg.id} className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end space-x-2 ${isMyMessage ? "flex-row-reverse" : ""}`}>
                <img src="https://avatar.iran.liara.run/public" alt="avatar" className="w-8 h-8 rounded-full" />
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                    isMyMessage
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-300 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 flex bg-white shadow-md">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatScreen;
