import { useState, useEffect } from 'react';
import './MessagePage.css';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch messages
  useEffect(() => {
    
    const fetchMessages = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/messages`);
        if (!response.ok) throw new Error('Network response failed');
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Safe sorting function
  const sortedMessages = [...messages].sort((a, b) => {
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Safe search filtering
  const filteredMessages = sortedMessages.filter(message => {
    const searchLower = (searchTerm || '').toLowerCase();
    return (
      (message.name || '').toLowerCase().includes(searchLower) ||
      (message.subject || '').toLowerCase().includes(searchLower) ||
      (message.message || '').toLowerCase().includes(searchLower)
    );
  });

  // Toggle sort direction
  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (loading) return <div className="loading-spinner">Loading messages...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Messages</h1>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name, subject, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search messages"
            className='form-control'
          />
        </div>

        <div className="sort-controls">
          <span>Sort by: </span>
          <button 
            onClick={() => requestSort('date')}
            className={sortConfig.key === 'date' ? 'active' : ''}
          >
            Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => requestSort('name')}
            className={sortConfig.key === 'name' ? 'active' : ''}
          >
            Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className="messages-list">
        {filteredMessages.length === 0 ? (
          <div className="no-messages">
            {searchTerm ? 'No messages match your search' : 'No messages available'}
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div 
              key={message.id} 
              className="message-card"
            >
              <div className="message-header">
                <span className="sender">
                  {message.name || 'Unknown'} 
                </span>
                <span className="date">
                  {message.date ? new Date(message.date).toLocaleString() : 'No date'}
                </span>
              </div>
              <h3 className="subject">{message.subject || 'No subject'}</h3>
              <div className="message-content">
                {message.message || 'No message content'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}