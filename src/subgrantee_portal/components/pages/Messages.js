import React, { useEffect, useState, useRef } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import { Send, ArrowClockwise } from "react-bootstrap-icons";

const Messages = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!room) return;
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(
        `/api/chat-room/${room.id}/messages/`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setMessages(data.results.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetchWithAuth(`/api/chat-room/${userId}/`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    if (userId) {
      fetchRoom();
    }
  }, [userId]);

  useEffect(() => {
    if (room) {
      fetchMessages();
    }
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !room) return;

    try {
      const response = await fetchWithAuth(
        `/api/chat-room/${room.id}/send_message/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newMessage }),
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      setNewMessage("");
      await fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!room) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Chat Support</h5>
          <button
            className="btn btn-light btn-sm"
            onClick={fetchMessages}
            disabled={isLoading}
          >
            <ArrowClockwise className={isLoading ? "spin" : ""} />
          </button>
        </div>
        <div
          className="card-body bg-light"
          style={{ height: "400px", overflowY: "auto" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 ${
                message.sender === userId ? "text-end" : "text-start"
              }`}
            >
              <div
                className={`d-inline-block p-2 rounded-3 shadow-sm ${
                  message.sender === userId
                    ? "bg-primary text-white"
                    : "bg-white"
                }`}
                style={{ maxWidth: "75%" }}
              >
                <p className="mb-1">{message.content}</p>
                <small
                  className={
                    message.sender === userId ? "text-light" : "text-muted"
                  }
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="card-footer bg-white">
          <form onSubmit={handleSendMessage} className="d-flex">
            <input
              type="text"
              className="form-control me-2 shadow-sm"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" className="btn btn-primary shadow-sm">
              <Send />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
