import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { SendHorizontalIcon } from "lucide-react";

const Chat = ({ userId, farmerId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const newSocket = io("ws://localhost:8000"); // Connect to the backend WebSocket
    setSocket(newSocket);

    newSocket.on("chat_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => newSocket.close();
  }, []);

  // Fetch chat history
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/chat_history/${farmerId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching chat history:", error));
  }, [farmerId]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const messageData = {
        sender: userId,
        receiver: farmerId,
        message: newMessage,
      };

      socket.emit("chat_message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");

      // Save message to backend
      axios.post("/api/chat/send/", messageData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    }
  };

  return (
    <div style={styles.chatContainer}>
      <h2>Chat with {}</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === userId ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === userId ? "#4CAF50" : "#f1f1f1",
              color: msg.sender === userId ? "white" : "black",
            }}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div style={styles.inputBox}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={styles.input}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} style={styles.sendButton}>
        <SendHorizontalIcon className="icon" />
        </button>
      </div>
    </div>
  );
};

// Inline CSS styles
const styles = {
  chatContainer: {
    width: "300px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  chatBox: {
    height: "300px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  message: {
    padding: "8px",
    borderRadius: "5px",
    maxWidth: "80%",
    marginBottom: "5px",
  },
  inputBox: {
    display: "flex",
    marginTop: "10px",
  },
  input: {
    flex: "1",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  sendButton: {
    padding: "8px 15px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    marginLeft: "5px",
    cursor: "pointer",
  },
};

export default Chat;
