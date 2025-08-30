import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from './AppIcon';
import Button from './ui/Button';

const AIAssistantFAB = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [showInitialWiggle, setShowInitialWiggle] = useState(true);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Remove wiggle animation after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialWiggle(false);
    }, 3000); // Wiggle for 3 seconds then stop
    return () => clearTimeout(timer);
  }, []);

  // Don't show the FAB on the AI Assistant page itself
  const isOnAIAssistantPage = location.pathname === '/ai-assistant-chat' || location.pathname === '/';

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      if (isChatOpen && !isChatMinimized) {
        setIsChatMinimized(true);
      } else {
        setIsChatOpen(!isChatOpen);
        setIsChatMinimized(false);
        if (!isChatOpen) {
          setUnreadCount(0); // Clear unread count when opening
        }
      }
      setIsClicked(false);
    }, 200);
  };

  const handleMinimize = () => {
    setIsChatMinimized(true);
  };

  const handleClose = () => {
    setIsChatOpen(false);
    setIsChatMinimized(false);
  };

  // Initialize with welcome message
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        sender: 'assistant',
        content: `Hi! I'm your AI assistant for machine learning. I can help you with:\n\n• Dataset analysis and preprocessing\n• Model selection and training\n• Deployment strategies\n• Troubleshooting and optimization\n\nHow can I help you today?`,
        timestamp: new Date()
      }]);
    }
  }, [isChatOpen, messages.length]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (content) => {
    if (!content.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your question. Let me analyze this for you...",
        "That's a great approach! Here are some additional considerations...",
        "Based on your dataset characteristics, I'd recommend...",
        "Let me break this down into actionable steps for you...",
        "This is a common challenge in ML. Here's how to address it..."
      ];

      const aiResponse = {
        id: Date.now() + 1,
        sender: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)] + `\n\nRegarding "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}", here's my detailed analysis and recommendations based on current ML best practices.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Increment unread count if chat is minimized
      if (isChatMinimized) {
        setUnreadCount(prev => prev + 1);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Don't render if we're already on the AI Assistant page
  if (isOnAIAssistantPage) {
    return null;
  }

  return (
    <>
      {/* Chat Widget Window */}
      {isChatOpen && !isChatMinimized && (
        <div className="fixed bottom-28 right-8 w-96 max-w-[calc(100vw-4rem)] h-[34rem] max-h-[calc(100vh-10rem)] bg-card border-2 border-accent/20 rounded-3xl shadow-2xl z-[9999] flex flex-col animate-slide-up backdrop-blur-md md:w-96">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-accent/10 to-primary/10 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                <Icon name="Sparkles" size={16} color="white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">AI Assistant</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMinimize}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors duration-150"
                title="Minimize chat"
              >
                <Icon name="Minus" size={16} className="text-muted-foreground" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors duration-150"
                title="Close chat"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-md' 
                    : 'bg-muted text-foreground rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground p-3 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex items-end space-x-2">
              <div className="flex-1 min-h-[2.5rem] max-h-32 bg-background border border-border rounded-xl p-3 focus-within:ring-2 focus-within:ring-accent">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about ML..."
                  className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  rows={1}
                  style={{
                    minHeight: '1.25rem',
                    height: 'auto'
                  }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                  }}
                />
              </div>
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 bg-accent hover:bg-accent/90 disabled:bg-muted disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors duration-150"
              >
                <Icon name="Send" size={16} color="white" />
              </button>
            </div>
            
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['Data preprocessing tips', 'Model selection help', 'Deployment guide'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-2 py-1 text-xs bg-accent/10 text-accent hover:bg-accent/20 rounded-full transition-colors duration-150"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Floating Action Button */}
      <div className={`fixed bottom-8 right-8 z-[9998] animate-float ${showInitialWiggle ? 'animate-wiggle' : ''}`}>
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/30 to-primary/30 animate-ping"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-ping" style={{animationDelay: '1s'}}></div>
        
        <button
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative w-18 h-18 rounded-full shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-500 group ${
            isClicked ? 'scale-90' : isHovered ? 'scale-125' : 'scale-100'
          } ${isChatOpen && !isChatMinimized ? 'bg-gradient-to-r from-muted-foreground to-muted border-2 border-accent' : 'bg-gradient-to-br from-accent via-primary to-accent hover:from-accent/80 hover:via-primary/80 hover:to-accent/80 border-2 border-white/20'} backdrop-blur-sm`}
          title={isChatOpen ? (isChatMinimized ? "Restore AI Assistant" : "Minimize AI Assistant") : "Open AI Assistant"}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
          
          <Icon 
            name={isChatOpen && !isChatMinimized ? "Minus" : "Sparkles"} 
            size={32} 
            color="white"
            className={`relative z-10 transition-all duration-500 ${isHovered ? 'rotate-180 scale-110' : ''} drop-shadow-lg`}
          />
          
          {/* Multi-layer pulse animation */}
          {!isChatOpen && (
            <>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-primary animate-ping opacity-30"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-accent to-primary animate-ping opacity-20" style={{animationDelay: '0.5s'}}></div>
            </>
          )}
          
          {/* Rotating border animation */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-accent via-primary to-accent bg-clip-border animate-spin" style={{animationDuration: '3s'}}></div>
        </button>
        
        {/* Unread messages badge */}
        {(isChatMinimized && unreadCount > 0) && (
          <div className="absolute -top-3 -right-3 w-7 h-7 bg-error rounded-full border-3 border-background flex items-center justify-center animate-bounce">
            <span className="text-xs font-bold text-error-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
        
        {/* Notification dot - only show when completely closed */}
        {!isChatOpen && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-success rounded-full border-2 border-background flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      {/* Enhanced Tooltip - only show when chat is closed */}
      {isHovered && !isChatOpen && (
        <div className="absolute bottom-full right-0 mb-4 px-5 py-4 bg-gradient-to-r from-accent/10 to-primary/10 backdrop-blur-md border-2 border-accent/20 rounded-2xl shadow-2xl animate-fade-in">
          <div className="text-sm font-bold text-foreground whitespace-nowrap flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
              <Icon name="Sparkles" size={12} color="white" />
            </div>
            <span>AI Assistant</span>
          </div>
          <div className="text-xs text-muted-foreground mt-2 flex items-center space-x-1">
            <Icon name="Zap" size={12} className="text-accent" />
            <span>Get instant ML help & guidance</span>
          </div>
          {/* Enhanced Arrow with glow */}
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-accent/20"></div>
          <div className="absolute top-full right-6 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-popover translate-y-px"></div>
        </div>
      )}
    </>
  );
};

export default AIAssistantFAB;
