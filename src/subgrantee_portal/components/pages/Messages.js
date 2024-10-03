import React, { useEffect, useState, useRef } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import { Send, ArrowClockwise, PersonCircle } from "react-bootstrap-icons";

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
      if (!response.ok) throw new Error("Failed to fetch messages");
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
      if (!userId) return;

      try {
        const response = await fetchWithAuth(`/api/chat-room/${userId}/`);
        if (!response.ok) throw new Error("Failed to fetch chat room");
        const data = await response.json();
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    fetchRoom();
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
      if (!response.ok) throw new Error("Failed to send message");
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">
                <PersonCircle className="me-2" size={24} />
                Chat Support
              </h5>
              <button
                className="btn btn-light btn-sm d-flex align-items-center"
                onClick={fetchMessages}
                disabled={isLoading}
              >
                <ArrowClockwise className={`me-1 ${isLoading ? "spin" : ""}`} />
                Refresh
              </button>
            </div>
            <div
              className="card-body bg-light"
              style={{ height: "500px", overflowY: "auto" }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 d-flex ${
                    message.sender.id === userId
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  <div
                    className={`card ${
                      message.sender.id === userId
                        ? "bg-primary text-white"
                        : "bg-white"
                    } border-0 shadow-sm`}
                    style={{ maxWidth: "75%" }}
                  >
                    <div className="card-body p-3">
                      <small className="d-block mb-1 fw-bold">
                        {message.sender.id === userId
                          ? "You"
                          : message.sender.organisation_name ||
                            message.sender.user_name}
                      </small>
                      <p className="mb-1">{message.content}</p>
                      <small className="text-muted">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="card-footer bg-white py-3">
              <form onSubmit={handleSendMessage} className="d-flex">
                <input
                  type="text"
                  className="form-control me-2 shadow-sm"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary shadow-sm px-4"
                >
                  <Send className="me-2" />
                  
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
