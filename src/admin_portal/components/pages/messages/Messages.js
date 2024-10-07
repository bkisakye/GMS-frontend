import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchWithAuth } from "../../../../utils/helpers";
import { Send, ArrowClockwise, Search } from "react-bootstrap-icons";
import { BsChatDots } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";

const Messages = () => {
  const [rooms, setRooms] = useState([]);
  const { chatRoomId } = useParams();
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user_id;

//   useEffect(() => {
//     if (chatRoomId) {
//     fetchChatRoom(chatRoomId);
//   }
// }, [chatRoomId]);

  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetchWithAuth(`/api/chat-room/all/`);
      const data = await response.json();
      setRooms(data.chat_rooms);
      setFilteredRooms(data.chat_rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const fetchMessages = useCallback(async (roomId) => {
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
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const filtered = rooms.filter((room) =>
      room.subgrantee.organisation_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [searchTerm, rooms]);

  const handleRoomSelect = useCallback((room) => {
    setSelectedRoom(room);
  }, []);

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

  const handleScroll = useCallback(() => {
    const { scrollTop } = messageListRef.current;
    if (scrollTop === 0) {
      // Load more messages when scrolled to top
      // Implement pagination logic here
    }
  }, []);

  return (
    <div className="container-fluid p-0 bg-light" style={{ height: "80vh" }}>
      <div className="row h-100 g-0">
        {/* Chat Rooms Section */}
        <div
          className="col-md-4 col-lg-3 border-end"
          style={{ height: "80vh", overflowY: "auto" }}
        >
          <div className="bg-white h-100 d-flex flex-column">
            <div className="p-3 bg-secondary text-white">
              <h5 className="mb-0 d-flex align-items-center">
                <BsChatDots className="me-2" /> Chats
              </h5>
            </div>
            <div className="p-2">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <Search />
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Search chat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-grow-1 overflow-auto">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className={`d-flex align-items-center p-3 border-bottom ${
                    selectedRoom?.id === room.id ? "bg-light" : ""
                  }`}
                  onClick={() => handleRoomSelect(room)}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <div className="flex-shrink-0">
                    <div
                      className="bg-info rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        fontSize: "1.2rem",
                      }}
                    >
                      <span className="text-white font-weight-bold">
                        {room.subgrantee.organisation_name
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3 overflow-hidden">
                    <h6 className="mb-0 text-truncate">
                      {room.subgrantee.organisation_name}
                    </h6>
                    <small className="text-muted text-truncate d-block">
                      Last message preview...
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages Section */}
        <div
          className="col-md-8 col-lg-9 d-flex flex-column"
          style={{ height: "77vh" }}
        >
          <div className="bg-secondary text-white p-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {selectedRoom
                ? selectedRoom.subgrantee.organisation_name
                : "Select a Room"}
            </h5>
            {selectedRoom && (
              <button
                className="btn btn-light btn-sm"
                onClick={() => fetchMessages(selectedRoom.id)}
                disabled={isLoading}
              >
                <ArrowClockwise className={isLoading ? "spin" : ""} />
              </button>
            )}
          </div>
          <div
            ref={messageListRef}
            className="flex-grow-1 overflow-auto p-3"
            style={{ backgroundColor: "#f0f2f5", minHeight: "0" }}
            onScroll={handleScroll}
          >
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 d-flex ${
                    message.sender.id === userId
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  <div
                    className={`d-inline-block p-3 rounded-3 shadow-sm ${
                      message.sender.id === userId
                        ? "bg-primary text-white"
                        : "bg-white"
                    }`}
                    style={{ maxWidth: "75%" }}
                  >
                    <p className="mb-1">{message.content}</p>
                    <small
                      className={
                        message.sender.id === userId
                          ? "text-light"
                          : "text-muted"
                      }
                    >
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted">No messages yet</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Area */}
          <div className="p-3 bg-white border-top" style={{ flexShrink: 0 }}>
            <form onSubmit={handleSendMessage} className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={!selectedRoom}
                style={{ minHeight: "50px" }}
              />
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={!selectedRoom || !newMessage.trim()}
              >
                <Send />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
