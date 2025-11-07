import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      const aiMessage = { text, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('API Error:', error);
      let errorText = 'Sorry, something went wrong.';
      
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        errorText = 'Model not available. Trying alternative model...';
      } else if (error.message?.includes('403') || error.status === 403) {
        errorText = 'API key is invalid or has restrictions. Please check your Gemini API key.';
      } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
        errorText = 'API quota exceeded. Please try again later.';
      } else if (error.message?.includes('network') || !navigator.onLine) {
        errorText = 'Network error. Please check your internet connection.';
      }
      
      const errorMessage = { text: errorText, sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-content">{message.text}</div>
            </div>
          ))}
          {loading && <div className="message ai loading">Thinking...</div>}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;