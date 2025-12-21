import React from 'react';
import './Message.css';

function Message({ message, username }) {
  const isUser = message.username === username;

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(parseInt(timestamp));
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // If message is from today, show only time
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    // If message is from yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    // Otherwise show date and time
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`message ${isUser ? 'message__user' : 'message__guest'}`}>
      <div className="message__content">
        {!isUser && (
          <p className="message__name">{message.username}</p>
        )}
        <p className="message__text">{message.message}</p>
        <span className="message__timestamp">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

export default Message;

