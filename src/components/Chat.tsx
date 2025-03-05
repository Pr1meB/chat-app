import { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../graphql/mutations";
import socket from "../websocket";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleSendMessage = async () => {
    await sendMessage({ variables: { input: { chatId: 1, senderId: 1, content: message } } });
    socket.send(JSON.stringify({ event: "new_message", payload: { message } }));
    setMessage("");
  };

  return (
    <div className="p-4">
      <input value={message} onChange={(e) => setMessage(e.target.value)} className="border p-2 w-full" />
      <button onClick={handleSendMessage} className="mt-2 bg-blue-500 text-white p-2">Send</button>
    </div>
  );
};

export default Chat;
