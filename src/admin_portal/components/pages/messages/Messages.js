import React, { useEffect, useState, useRef } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import {
  Send,
  ArrowClockwise,
  PersonCircle,
  ChatLeftDots,
  Chat,
  ChatDots,
  Person,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsChatDots } from "react-icons/bs";


const Messages = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetchWithAuth(`/api/chat-room/all/`);
        const data = await response.json();
        setRooms(data.chat_rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const fetchMessages = async (roomId) => {
    if (!roomId) return;
    setIsLoading(true);
    try {
      const response = await fetchWithAuth(
        `/api/chat-room/${roomId}/messages/`
      );
      const data = await response.json();
      setMessages(data.results.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      const response = await fetchWithAuth(
        `/api/chat-room/${selectedRoom.id}/send_message/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newMessage }),
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      setNewMessage("");
      await fetchMessages(selectedRoom.id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container-fluid py-4 h-100 bg-light">
      <div className="row h-100">
        <div className="col-md-3 mb-4">
          <div className="card h-90 shadow-sm border-0">
            <div className="card-header bg-primary text-white rounded-top d-flex align-items-center justify-content-between">
              <h5 className="mb-0 d-flex align-items-center">
                <BsChatDots className="me-2" /> Chats
              </h5>
            </div>
            <div className="card-body p-0 overflow-auto">
            
                {rooms.map((room) => (
                  <card
                    key={room.id}
                    className={`list-group-item list-group-item-action d-flex align-items-center ${
                      selectedRoom?.id === room.id
                        ? "active bg-primary text-white"
                        : ""
                    }`}
                    onClick={() => handleRoomSelect(room)}
                    style={{ cursor: "pointer" }}
                  >
                    <Person
                      size={24}
                      className={`me-3 ${
                        selectedRoom?.id === room.id
                          ? "text-white"
                          : "text-dark"
                      }`}
                    />
                    <span className="text-truncate">
                      {room.subgrantee.organisation_name}
                    </span>
                  </card>
                ))}
            
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {selectedRoom
                  ? `Chat with ${selectedRoom.subgrantee.organisation_name}`
                  : "Select a Room"}
              </h5>
              {selectedRoom && (
                <button
                  className="btn btn-light btn-sm d-flex align-items-center"
                  onClick={() => fetchMessages(selectedRoom.id)}
                  disabled={isLoading}
                >
                  <ArrowClockwise
                    className={`me-2 ${isLoading ? "spin" : ""}`}
                  />
                  Refresh
                </button>
              )}
            </div>
            <div
              className="card-body bg-light p-3 overflow-auto"
              style={{ height: "calc(100vh - 250px)" }}
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
                    className={`p-3 rounded-3 shadow-sm ${
                      message.sender.id === userId
                        ? "bg-primary text-white"
                        : "bg-white"
                    }`}
                    style={{ maxWidth: "75%" }}
                  >
                    <small className="d-block mb-1 fw-bold">
                      {message.sender.id === userId
                        ? "You"
                        : message.sender.organisation_name}
                    </small>
                    <p className="mb-1">{message.content}</p>
                    <small
                      className={`text-muted ${
                        message.sender.id === userId
                          ? "text-light"
                          : "text-muted"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="card-footer bg-white rounded-bottom">
              <form onSubmit={handleSendMessage} className="d-flex">
                <input
                  type="text"
                  className="form-control me-2 shadow-sm"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={!selectedRoom}
                />
                <button
                  type="submit"
                  className="btn btn-primary shadow-sm"
                  disabled={!selectedRoom}
                >
                  <Send className="me-2" /> Send
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
