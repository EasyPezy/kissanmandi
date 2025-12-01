import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const Chat = () => {
  const { buyerId, farmId } = useParams();
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [farm, setFarm] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChat();
    fetchFarm();
  }, [buyerId, farmId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChat = async () => {
    try {
      const response = await axios.get(`/api/chat/${buyerId}/${farmId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const fetchFarm = async () => {
    try {
      const response = await axios.get(`/api/farms/${farmId}`);
      setFarm(response.data);
    } catch (error) {
      console.error('Error fetching farm:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(`/api/chat/${buyerId}/${farmId}/message`, {
        sender: 'buyer',
        message: newMessage,
      });
      setNewMessage('');
      fetchChat();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('chat')}</h1>

      {farm && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold">{farm.farmName}</h2>
          <p className="text-gray-600">{farm.farmerName} - {farm.nearestCity}, {farm.state}</p>
          <p className="text-gray-600">{farm.cropType} - {farm.availableQuantity} kg available</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === 'buyer'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 border rounded px-4 py-2"
          />
          <button
            onClick={sendMessage}
            className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

