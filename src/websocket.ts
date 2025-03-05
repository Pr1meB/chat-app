import { store } from "./redux/store"; // Import Redux store
import { RootState } from "./redux/rootReducer"; // Import RootState for Redux typing

const BASE_WS_URL = "wss://chat-project-6vmq.onrender.com/ws/chat/";

class WebSocketManager {
  private socket: WebSocket | null = null;
  private chatId: string | null = null;
  private messageHandlers: ((data: any) => void)[] = [];
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 3000; // 3 seconds delay

  connect(chatId: string) {
    if (this.socket) {
      this.socket.close();
    }

    this.chatId = chatId;

    // 🔥 Get token from Redux store
    const state: RootState = store.getState();
    const token = state.auth.token; // Adjust based on your Redux state structure

    // Append token to WebSocket URL
    const wsUrl = `${BASE_WS_URL}${chatId}/?token=${token}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log("Connected to WebSocket");
      this.reconnectAttempts = 0; // Reset reconnect attempts on success
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageHandlers.forEach((handler) => handler(data));
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.warn("WebSocket closed. Attempting to reconnect...");
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => this.connect(chatId), this.reconnectDelay);
        this.reconnectAttempts++;
      } else {
        console.error("Max WebSocket reconnect attempts reached.");
      }
    };
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not open. Unable to send message.");
    }
  }

  addMessageHandler(handler: (data: any) => void) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: (data: any) => void) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }
}

const websocket = new WebSocketManager();
export default websocket;
