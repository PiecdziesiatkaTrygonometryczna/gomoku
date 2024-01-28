import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const client = mqtt.connect('ws://localhost:9001', {
    username: 'newuser',
    password: '123',
});

  useEffect(() => {
    client.on('connect', () => {
        console.log('Connected to MQTT server');
        client.subscribe('chat');
    });

    client.on('error', (error) => {
        console.error('Error connecting to MQTT server', error);
    });

    client.on('message', (topic, message) => {
        console.log(`Received message on ${topic}: ${message}`);
        const receivedMessage = JSON.parse(message.toString());
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    });

    return () => {
        client.end();
    };
}, [client]);
const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageObject = {
        userId,
        text: newMessage,
    };

    console.log('Publishing message', messageObject);
    client.publish('chat', JSON.stringify(messageObject));

    setMessages((prevMessages) => [...prevMessages, messageObject]);

    setNewMessage('');
};

  return (
    <div>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', marginBottom: '10px' }}>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.userId}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
