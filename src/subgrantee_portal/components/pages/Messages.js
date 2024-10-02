import React, { useEffect, useState, useRef } from "react";
import { fetchWithAuth } from "../../../utils/helpers";
import "bootstrap/dist/css/bootstrap.min.css";
import { Send } from "react-bootstrap-icons";

const Messages = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;
  const [room, setRoom] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch the chat room for the user
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetchWithAuth(`/api/chat-room/${userId}/`);
        const data = await response.json();
        setRoomId(data.id);
        setRoom(data);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    if (userId) {
      fetchRoom();
    }
  }, [userId]);

  // Fetch messages for the chat room
  useEffect(() => {
    const fetchMessages = async () => {
      if (!roomId) return;
      try {
        const response = await fetchWithAuth(
          `/api/chat-room/${roomId}/messages/`
        );
        const data = await response.json();
        setMessages(data.results);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  // Scroll to the bottom of the messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      return; // Prevent sending empty messages
    }
    try {
      const response = await fetchWithAuth(
        `/api/chat-room/${roomId}/send_message/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, data.message]);
      setNewMessage(""); // Clear the input field after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Show a loading spinner if roomId is not yet available
  if (!roomId) {
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
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            Chat Room For:{" "}
            {room.subgrantee?.organisation_name || "Unknown Organization"}
          </h5>
        </div>
        <div
          className="card-body"
          style={{ height: "400px", overflowY: "auto" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 ${
                msg.sender === userId ? "text-end" : "text-start"
              }`}
            >
              <div
                className={`d-inline-block p-2 rounded ${
                  msg.sender === userId ? "bg-primary text-white" : "bg-light"
                }`}
                style={{ maxWidth: "75%" }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="card-footer">
          <form onSubmit={handleSendMessage}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button className="btn btn-primary" type="submit">
                <Send />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
